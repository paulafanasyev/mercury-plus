// Fixed Panoramax catalogue adapter. Returns coordinates and original viewer links only.
// Never proxies thumbnails, SD images or original photo bytes.
const PANORAMAX_API = "https://api.panoramax.xyz/api/search";
const PILOT_BBOX = "106.60,10.65,106.90,10.98";
const RESULT_LIMIT = 100;
const APP_ORIGIN = "https://mercury-plus.vercel.app";

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Cache-Control", status === 200
    ? "public, s-maxage=1800, stale-while-revalidate=7200"
    : "no-store, max-age=0");
  res.end(JSON.stringify(body));
}

function allowedLicense(feature) {
  const license = String(feature.license || "");
  const link = (feature.links || []).find(item => item.rel === "license");
  const href = String(link && link.href || "");
  return /CC-BY-SA-4\.0/i.test(license) ||
    /creativecommons\.org\/licenses\/by-sa\/4\.0/i.test(href);
}

module.exports = async function panoramaxPhotosHandler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return send(res, 405, { error: "Method not allowed." });
  }
  const origin = req.headers.origin;
  const localOrigin = typeof origin === "string" && /^http:\/\/localhost(?::\d+)?$/.test(origin);
  if (origin && origin !== APP_ORIGIN && !localOrigin) {
    return send(res, 403, { error: "Origin is not allowed." });
  }
  const params = new URLSearchParams({ bbox: PILOT_BBOX, limit: String(RESULT_LIMIT) });
  const url = PANORAMAX_API + "?" + params.toString();

  try {
    const upstream = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/geo+json, application/json",
        "User-Agent": "MercuryPlus-HCMC-Pilot/1.0 (+https://mercury-plus.vercel.app/)",
        "Referer": APP_ORIGIN + "/"
      },
      signal: AbortSignal.timeout(15000)
    });
    if (!upstream.ok) return send(res, 502, { error: "Panoramax catalogue is temporarily unavailable (HTTP " + upstream.status + ")." });
    const payload = await upstream.json();
    if (!payload || !Array.isArray(payload.features)) return send(res, 502, { error: "Panoramax returned an unexpected catalogue response." });

    const groups = new Map();
    const authorCounts = new Map();
    const captureTimes = [];
    let acceptedCount = 0;
    for (const feature of payload.features) {
      if (!feature || !feature.geometry || feature.geometry.type !== "Point" ||
          !Array.isArray(feature.geometry.coordinates) || feature.geometry.coordinates.length < 2 ||
          !feature.properties || !allowedLicense(feature)) continue;
      const visibility = String(feature.properties.visibility || feature.properties["geovisio:visibility"] || "");
      const status = String(feature.properties["geovisio:status"] || "");
      if (visibility !== "anyone" || status !== "ready") continue;
      const lon = Number(feature.geometry.coordinates[0]), lat = Number(feature.geometry.coordinates[1]);
      if (!Number.isFinite(lat) || !Number.isFinite(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) continue;
      const id = String(feature.id || "");
      if (!/^[0-9a-f-]{20,60}$/i.test(id)) continue;

      const key = lat.toFixed(4) + "," + lon.toFixed(4);
      if (!groups.has(key)) groups.set(key, {lat,lon,count:0,items:[]});
      const group = groups.get(key);
      group.count++;
      acceptedCount++;
      const providers = Array.isArray(feature.providers) ? feature.providers : [];
      const author = providers.map(provider => String(provider.name || "")).filter(Boolean).slice(0,3).join(", ") ||
        String(feature.properties["geovisio:producer"] || "Автор не указан").slice(0,100);
      authorCounts.set(author,(authorCounts.get(author)||0)+1);
      const exif = feature.properties.exif || {};
      const capturedAt = feature.datetime || feature.properties.datetime ||
        exif["Exif.Photo.DateTimeOriginal"] || exif["Exif.Image.DateTime"] || null;
      if(capturedAt) captureTimes.push(String(capturedAt));
      group.items.push({
        id,
        capturedAt: capturedAt ? String(capturedAt) : null,
        author,
        license: "CC BY-SA 4.0",
        viewerUrl: "https://api.panoramax.xyz/?focus=pic&pic=" + id
      });
    }
    const locations = Array.from(groups.values()).map(group => ({
      lat:group.lat, lon:group.lon, count:group.count,
      items:group.items.sort((a,b)=>String(b.capturedAt||"").localeCompare(String(a.capturedAt||""))).slice(0,20)
    })).sort((a,b)=>b.count-a.count);
    const topAuthor = Array.from(authorCounts.entries()).sort((a,b)=>b[1]-a[1])[0] || null;
    captureTimes.sort();
    return send(res,200,{
      metadata:{
        source:"Panoramax community photo catalogue",bbox:PILOT_BBOX,resultLimit:RESULT_LIMIT,
        photoCount:acceptedCount,locationCount:locations.length,
        dominantAuthorSharePercent:topAuthor&&acceptedCount?Math.round(topAuthor[1]*100/acceptedCount):0,
        earliestCapture:captureTimes[0]||null,latestCapture:captureTimes[captureTimes.length-1]||null,
        checkedAt:new Date().toISOString(),photosEmbedded:false,originalViewerOnly:true
      },
      locations
    });
  } catch(error) {
    const timedOut=error&&(error.name==="TimeoutError"||error.name==="AbortError");
    return send(res,502,{error:timedOut?"Panoramax catalogue request timed out. Please retry later.":"Panoramax catalogue could not be reached."});
  }
};
