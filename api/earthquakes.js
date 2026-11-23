// HCMC-centred regional earthquake catalogue proxy for Mercury Plus.
// Fixed USGS upstream and fixed query parameters; no arbitrary URL forwarding.
const USGS_API = "https://earthquake.usgs.gov/fdsnws/event/1/query";
const HCMC = { latitude: 10.7769, longitude: 106.7009 };
const RADIUS_KM = 1000;
const MIN_MAGNITUDE = 3.5;
const MAX_EVENTS = 200;
const CACHE_SECONDS = 900;

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/geo+json; charset=utf-8");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Cache-Control", status === 200
    ? "public, s-maxage=900, stale-while-revalidate=3600"
    : "no-store, max-age=0");
  res.end(JSON.stringify(body));
}

function dayString(date) {
  return date.toISOString().slice(0, 10);
}

module.exports = async function earthquakesHandler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return send(res, 405, { error: "Method not allowed." });
  }

  const origin = req.headers.origin;
  const localOrigin = typeof origin === "string" && /^http:\/\/localhost(?::\d+)?$/.test(origin);
  const appOrigin = "https://mercury-plus.vercel.app";
  if (origin && origin !== appOrigin && !localOrigin) {
    return send(res, 403, { error: "Origin is not allowed." });
  }

  const now = new Date();
  const start = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
  const params = new URLSearchParams({
    format: "geojson",
    starttime: dayString(start),
    endtime: dayString(now),
    latitude: String(HCMC.latitude),
    longitude: String(HCMC.longitude),
    maxradiuskm: String(RADIUS_KM),
    minmagnitude: String(MIN_MAGNITUDE),
    orderby: "time",
    limit: String(MAX_EVENTS)
  });
  const url = USGS_API + "?" + params.toString();

  try {
    const upstream = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/geo+json, application/json",
        "User-Agent": "MercuryPlus-HCMC-Pilot/1.0 (+https://mercury-plus.vercel.app/)",
        "Referer": appOrigin + "/"
      },
      signal: AbortSignal.timeout(15000)
    });
    if (!upstream.ok) {
      return send(res, 502, { error: "USGS catalogue is temporarily unavailable (HTTP " + upstream.status + ")." });
    }

    const payload = await upstream.json();
    if (!payload || !Array.isArray(payload.features)) {
      return send(res, 502, { error: "USGS returned an unexpected GeoJSON response." });
    }

    const features = payload.features.slice(0, MAX_EVENTS).filter(feature => {
      const coordinates = feature && feature.geometry && feature.geometry.coordinates;
      const properties = feature && feature.properties;
      return Array.isArray(coordinates) && coordinates.length >= 2 &&
        Number.isFinite(Number(coordinates[0])) &&
        Number.isFinite(Number(coordinates[1])) &&
        properties && Number.isFinite(Number(properties.mag)) &&
        typeof properties.url === "string" &&
        properties.url.startsWith("https://earthquake.usgs.gov/");
    }).map(feature => ({
      type: "Feature",
      id: String(feature.id || ""),
      geometry: {
        type: "Point",
        coordinates: [
          Number(feature.geometry.coordinates[0]),
          Number(feature.geometry.coordinates[1]),
          Number(feature.geometry.coordinates[2]) || 0
        ]
      },
      properties: {
        mag: Number(feature.properties.mag),
        place: String(feature.properties.place || "").slice(0, 240),
        time: Number(feature.properties.time) || null,
        url: feature.properties.url,
        tsunami: Number(feature.properties.tsunami) === 1
      }
    }));

    return send(res, 200, {
      type: "FeatureCollection",
      metadata: {
        source: "USGS Earthquake Hazards Program / ComCat",
        generated: Number(payload.metadata && payload.metadata.generated) || Date.now(),
        queryStart: dayString(start),
        queryEnd: dayString(now),
        center: HCMC,
        radiusKm: RADIUS_KM,
        minimumMagnitude: MIN_MAGNITUDE,
        resultCount: features.length,
        cacheSeconds: CACHE_SECONDS
      },
      features
    });
  } catch (error) {
    const timedOut = error && (error.name === "TimeoutError" || error.name === "AbortError");
    return send(res, 502, {
      error: timedOut ? "USGS catalogue request timed out. Please retry later." : "USGS catalogue could not be reached."
    });
  }
};
