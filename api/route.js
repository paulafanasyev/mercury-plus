// Narrow, same-origin OSRM route adapter for the public HCMC pilot.
// Never accepts an arbitrary upstream URL. No route responses are cached or stored.
const OSRM_HOST = "https://router.project-osrm.org";
const APP_ORIGIN = "https://mercury-plus.vercel.app";
const MIN_INTERVAL_MS = 1000;
const lastRequestByClient = new Map();

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.end(JSON.stringify(body));
}

function coordinatePair(value) {
  if (typeof value !== "string") return null;
  const parts = value.split(",");
  if (parts.length !== 2) return null;
  const lng = Number(parts[0]);
  const lat = Number(parts[1]);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
  return { lat, lng };
}

module.exports = async function routeHandler(req, res) {
  const origin = req.headers.origin;
  const localOrigin = typeof origin === "string" && /^http:\/\/localhost(?::\d+)?$/.test(origin);
  if (origin && origin !== APP_ORIGIN && !localOrigin) {
    return json(res, 403, { error: "Origin is not allowed." });
  }
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return json(res, 405, { error: "Method not allowed." });
  }

  const start = coordinatePair(req.query.start);
  const end = coordinatePair(req.query.end);
  if (!start || !end) {
    return json(res, 400, { error: "Provide start and end as longitude,latitude." });
  }
  if (Math.abs(start.lng - end.lng) > 1.5 || Math.abs(start.lat - end.lat) > 1.5) {
    return json(res, 400, { error: "This pilot route endpoint is limited to nearby HCMC-area journeys." });
  }
  if (Math.abs(start.lng - end.lng) < 0.00001 && Math.abs(start.lat - end.lat) < 0.00001) {
    return json(res, 400, { error: "Choose two different points." });
  }

  const forwarded = req.headers["x-forwarded-for"];
  const clientId = (Array.isArray(forwarded) ? forwarded[0] : String(forwarded || "").split(",")[0]).trim()
    || (req.socket && req.socket.remoteAddress)
    || "unknown";
  const now = Date.now();
  const previous = lastRequestByClient.get(clientId) || 0;
  if (now - previous < MIN_INTERVAL_MS) {
    res.setHeader("Retry-After", "1");
    return json(res, 429, { error: "Please wait one second before requesting another route." });
  }
  lastRequestByClient.set(clientId, now);
  if (lastRequestByClient.size > 5000) {
    for (const [key, timestamp] of lastRequestByClient) {
      if (now - timestamp > 60000) lastRequestByClient.delete(key);
      if (lastRequestByClient.size <= 4000) break;
    }
  }

  const coordinates = start.lng + "," + start.lat + ";" + end.lng + "," + end.lat;
  const url = OSRM_HOST + "/route/v1/driving/" + coordinates +
    "?steps=true&overview=full&geometries=geojson&alternatives=false";
  try {
    const upstream = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "User-Agent": "MercuryPlus-HCMC-Pilot/1.0 (+https://mercury-plus.vercel.app/)",
        "Referer": APP_ORIGIN + "/"
      },
      signal: AbortSignal.timeout(12000)
    });
    if (!upstream.ok) {
      return json(res, 502, { error: "Routing provider is temporarily unavailable (HTTP " + upstream.status + ")." });
    }
    const payload = await upstream.json();
    const route = payload && payload.code === "Ok" && Array.isArray(payload.routes) ? payload.routes[0] : null;
    if (!route || !route.geometry || !Array.isArray(route.legs)) {
      return json(res, 422, { error: "No drivable route was found between these points." });
    }
    const steps = route.legs.flatMap(leg => Array.isArray(leg.steps) ? leg.steps : []).slice(0, 100)
      .map(step => ({
        name: String(step.name || "").slice(0, 160),
        rotaryName: String(step.rotary_name || "").slice(0, 160),
        distanceMeters: Number(step.distance) || 0,
        durationSeconds: Number(step.duration) || 0,
        maneuver: {
          type: String(step.maneuver && step.maneuver.type || ""),
          modifier: String(step.maneuver && step.maneuver.modifier || "")
        }
      }));
    return json(res, 200, {
      code: "Ok",
      route: {
        geometry: route.geometry,
        distanceMeters: Number(route.distance) || 0,
        durationSeconds: Number(route.duration) || 0,
        summary: String(route.legs.map(leg => leg.summary || "").filter(Boolean).join(" · ")).slice(0, 300),
        steps
      },
      attribution: "© OpenStreetMap contributors · Routing by OSRM"
    });
  } catch (error) {
    const timedOut = error && (error.name === "TimeoutError" || error.name === "AbortError");
    return json(res, 502, {
      error: timedOut ? "Routing provider timed out. Please retry later." : "Routing provider could not be reached."
    });
  }
};
