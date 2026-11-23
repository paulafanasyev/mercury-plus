# Mercury Plus — God's Eye View parity matrix

**Checked:** 2026-11-23  
**Target:** public, non-commercial browser pilot for Ho Chi Minh City, Vietnam  
**Upstream:** [bilawalsidhu/gods-eye-view](https://github.com/bilawalsidhu/gods-eye-view)  
**Mercury Plus:** [paulafanasyev/mercury-plus](https://github.com/paulafanasyev/mercury-plus)

## Executive status

Mercury Plus is still a small Leaflet application, not a port of God's Eye View. Production has an HCMC-centred OSM map, a Public Cameras section linking to the official portal, user-triggered driving routes and an on-demand Open-Meteo model-weather card. The official camera portal's terms expressly require prior written permission for reuse; no camera snapshots/video are embedded. No upstream GEV application modules have been imported.

**Production verification:** Vercel deployment `dpl_4QG17oNFZEoP2bWxiCiJEULgFuSQ`, commit `81b628ac59536cc04eda2c8ce2b79d25f8f74116`, state **READY**. Public page returned HTTP 200 and the live HTML contains the route planner controls and Public Cameras section. The same-origin route API returned HTTP 200 for a central-HCMC test route and HTTP 400 for malformed coordinates. The browser click-to-route interaction has not yet been manually tested on a physical device.

Status vocabulary:
- **VERIFIED** — current implementation or source fact has been inspected.
- **PARTIAL** — some of the capability exists, but required functionality is missing.
- **NOT IMPLEMENTED** — no working Mercury Plus implementation.
- **NOT VERIFIED** — candidate source or right exists, but access/coverage/permission is unconfirmed.
- **EXCLUDE** — deliberately outside the HCMC pilot or excluded for privacy/safety reasons.

## Feature parity

| God's Eye View capability | Mercury Plus now | HCMC suitability / source path | Dependencies and rights gate | Priority |
|---|---|---|---|---|
| 2D street basemap | **VERIFIED** — Leaflet + OSM tiles, attribution visible | Useful city base map | Follow OSM tile usage policy and ODbL attribution; public tile service has no SLA | Keep |
| Satellite basemap | **PARTIAL** — Esri imagery option; visitor supplies their own ArcGIS key | Useful for HCMC | Key stored in browser, not a server secret; enforce referrer restrictions and Esri quotas/attribution | High |
| Cesium 3D globe / terrain / 3D buildings | **NOT IMPLEMENTED** | Relevant as a map presentation mode | CesiumJS integration; ion token / Google photorealistic tiles have separate current terms, quotas and non-commercial eligibility; do not imply all HCMC is covered | High |
| CCTV Mesh / traffic cameras | **PARTIAL** — official portal link is live; in-app cameras are disabled | Official portal: https://giaothong.hochiminhcity.gov.vn/Map.aspx. Its Terms of Use permit personal viewing only and prohibit copying, publishing or reuse without prior written permission | Explicit written permission is required before third-party display/embedding. It must define metadata reuse, JPEG/HLS, cadence, caching, attribution, allowed domain and takedown. No proxy, bulk polling, media storage or redistribution before approval | **Critical** |
| Camera map metadata (IDs, names, coordinates) | **NOT IMPLEMENTED** — no catalogue imported | Community catalogue: https://github.com/MeoPaoo/camera-giao-thong-data | Its code licence does not grant rights to official camera media or automatically clear a synchronized catalogue. Confirm data provenance and operator permission before reuse | Critical |
| Street Level photos / panoramas | **NOT IMPLEMENTED** | Potential HCMC coverage via Mapillary, KartaView, Panoramax and Google Street View must be queried and measured | Mapillary client token; Google Maps key and billing; KartaView/Panoramax are public APIs but per-image licence/attribution and caching rules apply. Verify city coverage before enabling | Medium |
| Mapped ALPR camera locations | **EXCLUDE** from the public pilot by default | Not needed to provide traffic context | Even location-only ALPR overlays can facilitate surveillance. No number-plate data, recognition, person identification or tracking is to be implemented | Exclude |
| Aircraft / ADS-B | **NOT IMPLEMENTED** | Tan Son Nhat and regional airspace context could be relevant | OpenSky has non-commercial research/education conditions and rate limits; adsb.lol is an alternate feed. Verify exact terms, HCMC coverage and freshness; keep provider credentials server-side if required | Medium |
| Vessels / AIS | **NOT IMPLEMENTED** | Potentially relevant to Saigon River and port approaches | AISStream registration/API key and provider conditions; verify local coverage, update cadence and redistribution/display rights | Medium |
| Satellites / orbital tracks | **NOT IMPLEMENTED** | Global overlay, not HCMC-specific | CelesTrak TLE/SATCAT feeds; orbit computation and clear “predicted position” label. Model/texture assets need separate provenance review | Low |
| Live transit vehicles | **NOT IMPLEMENTED** | HCMC buses and metro would be useful, but an official real-time vehicle-position feed has not been verified | Find operator/authority GTFS and GTFS-Realtime sources, terms, API access, freshness, attribution and geographic coverage. Do not draw vehicles from timetables as if live | High |
| Live rail / metro | **NOT IMPLEMENTED** | Metro Line 1 and future rail context are relevant | Need operator-published live positions or a documented feed; static schedules alone are not live tracking | Medium |
| Road traffic conditions / congestion | **NOT IMPLEMENTED** | High relevance | Official traffic-speed/incident feed or licensed provider (for example TomTom); a camera image is not a measured traffic-speed feed. Provider key, billing and storage rules may apply | High |
| Directions / routing | **PARTIAL — PRODUCTION API VERIFIED** — two-point driving route UI is deployed; same-origin API returned HTTP 200 with geometry and turn steps (1.31 km test route). Malformed coordinates returned HTTP 400. Manual map-click interaction test remains pending | Useful within HCMC | Fixed OSRM upstream, coordinate validation, timeout, no-store response, app User-Agent/Referer and a per-client in-memory 1 req/s guard per warm Vercel function instance. This is **not a global rate limit** across serverless instances. OSRM demo is best-effort with no SLA; use a shared global limiter or self-host OSRM before public scale. OSM/OSRM attribution is shown | High |
| OSM Places / place search | **NOT IMPLEMENTED** — search currently reports not connected | Useful for hospitals, transit stops, public facilities and local places | GEV uses a dedicated Overpass upstream. Need rate limits, user-triggered search, caching policy, language/alias handling and attribution; do not scrape commercial map products | High |
| Administrative boundaries | **NOT IMPLEMENTED** as a separate overlay | Important after HCMC's post-2025 boundary changes | Select an authoritative current boundary dataset; confirm version, exact geographic extent, licence and update time. OSM fallback under ODbL | High |
| Roads, waterways, bridges and public facilities | **PARTIAL** — visible only as part of OSM base tiles, no selectable data overlays | Very relevant | Prefer individual HCMC Open Data/HCMGIS records. Every selected record needs its own licence, distribution/API, freshness and attribution review | High |
| Weather / wind / forecast | **PARTIAL — MODEL WEATHER CARD** — on-demand current model conditions for HCMC (temperature, feels-like, humidity, precipitation, wind and gusts) with model timestamp and grid-cell coordinates | Open-Meteo Forecast API, global model grid; current values are model estimates, not ground-station observations. Radar, lightning and a multi-day forecast layer are not implemented | Free endpoint only for non-commercial use; fewer than 10,000 calls/day, 5,000/hour, 600/minute. API data CC BY 4.0; visible Open-Meteo attribution required. No background polling; review paid terms before commercial use | High |
| Rain radar / satellite clouds / lightning | **NOT IMPLEMENTED** | Some global/regional satellite layers may work; GEV's US radar layers do not cover HCMC | Use regional/global imagery only after checking geographic coverage, refresh, licensing and attribution. Do not show US-only NOAA radar as a local HCMC observation | Medium |
| Flooding / rainfall / drainage context | **NOT IMPLEMENTED** | Very high local relevance | Official HCMC environment, hydrology and drainage observations/forecasts are preferred. Separate observed, forecast and modelled values, include timestamps and stale states | High |
| Tropical cyclone warnings | **NOT IMPLEMENTED** | Relevant to the Western Pacific | Prefer authoritative Vietnam/Western Pacific warning feeds; GEV NHC/CPHC US-centric products are not a substitute for local warnings | Medium |
| Active fires | **NOT IMPLEMENTED** | Regional context | NASA FIRMS API/key and current terms; label satellite detections and observation time, not ground-confirmed fires | Low |
| Earthquakes | **NOT IMPLEMENTED** | Regional/global context | USGS GeoJSON is a potential no-key source; verify current API policy and label magnitude/location/time as provider-reported | Low |
| Radio / audio | **NOT IMPLEMENTED** | Optional, not core to HCMC situational awareness | Radio Browser metadata is not a blanket licence for station audio; each stream has its own terms and copyright | Low |
| News / general events | **NOT IMPLEMENTED** | Could be useful only with vetted local feeds | Source attribution, publication time, geolocation confidence and misinformation controls needed | Low |
| US-specific restricted airspace, military/site overlays and other national packs | **EXCLUDE** unless a directly relevant, lawfully published HCMC source is found | Most source packs are not HCMC data | Never relabel US or other country data as HCMC. Avoid sensitive infrastructure and security-sensitive datasets | Exclude |
| Time slider, historical playback, trails, per-layer filters and context cards | **NOT IMPLEMENTED** beyond basic map controls/dialogs | Useful once real timestamped feeds exist | Requires a normalized data schema, server/client state, timestamps and a clear stale-data policy. Do not create playback from static snapshots as if they were continuous live history | Medium |
| Layer attribution, source/freshness panel and data status | **PARTIAL** — pending/offline labels and basic OSM attribution exist | Required across all live layers | Every layer must expose provider, coverage, data timestamp, update cadence, licence and source link | High |
| Backend provider proxies and secrets | **NOT IMPLEMENTED** — static site only | Needed for keys, rate-control and approved provider integrations | Add server-side endpoints only where provider terms permit. Never commit keys or use a generic open proxy. Restrict outbound hosts, request paths, payload sizes, cache and rate | Critical |
| Resilience, automated tests and runtime observability | **PARTIAL** — Vercel production deployment READY; no broad feature test suite is present | Required before claiming live parity | Add schema/unit tests, provider contract tests, browser smoke tests, stale/offline tests, request-volume checks and monitoring | Critical |

## Camera decision and next actions

### Current verified facts
1. The official HCMC traffic portal is publicly reachable and publishes camera imagery for residents.
2. A community-maintained catalogue describes camera IDs, positions and optional image/HLS URLs, and synchronizes from the public portal.
3. The community catalogue's MIT code notice does not license the official camera images or video.
4. A third-party camera aggregator's counts are not an authoritative official inventory and do not grant Mercury Plus reuse rights.
5. Permission to embed the official city's camera content in Mercury Plus, to frame its images, to proxy/copy them, or to play HLS streams is **NOT VERIFIED**.

### Work already completed
- Sidebar section **PUBLIC CAMERAS** is live on the production page.
- It labels in-app embedding as **PENDING**.
- It links directly to the official city portal.
- `docs/CAMERA_SOURCE_AUDIT.md` records source/rights findings and acceptance criteria.
- `docs/CAMERA_PERMISSION_REQUEST.md` contains a Vietnamese and English request draft.
- Public contact route identified: `ttqltt.sgtvt@tphcm.gov.vn`, `+84 8 3914 3560`, via the Urban Traffic Management and Operations Center website. The Center is a contact route, not yet confirmed as the sole camera rights holder or final approver.

### Permission sequence
1. Send the bilingual request to the Center and ask it to identify the authorized data owner if it is not the approver.
2. Obtain a written answer covering metadata, direct JPEG display, HLS playback, refresh/rate limits, caching/proxy rules, attribution, allowed domain and revocation/takedown.
3. Only then build the approved camera catalogue and player.
4. Start with a small sample (at least 3 authorised cameras across different city areas), one camera loaded on click, visible source attribution and last-frame time.
5. Test denied, stale, offline, timeout and rate-limit states before scaling up.

### Camera implementation acceptance gate
- Camera markers are sourced from an approved metadata feed/file, not guessed coordinates.
- The camera image or stream is requested only after the user selects the camera, unless the operator explicitly permits another refresh policy.
- Media is displayed directly from an approved official endpoint unless proxy/cache is explicitly authorised.
- HLS is enabled only for individually confirmed HTTPS streams and with explicit user action.
- No image/video storage, analytics, face/plate recognition, identity inference or individual tracking.
- A public deployment shows operator attribution and a clear stale/offline state.

## Implementation order

1. **Rights and backend foundation:** obtain HCMC camera permission; design provider adapters, server-side secret handling, rate limits and source status metadata.
2. **Map foundation:** port the GEV Vue 3 / Pinia / CesiumJS architecture or deliberately replace the Leaflet shell with an equivalent Cesium globe; preserve GEV MIT notices and exclude non-HCMC data packs.
3. **First local layers:** official boundaries, roads/waterways/bridges, public facilities, place search and routing.
4. **Camera pilot:** enable only the approved HCMC subset and pass the camera acceptance gate.
5. **Movement layers:** aircraft, vessels, transit and rail only where HCMC data sources and terms are verified.
6. **Environment and events:** weather, rainfall/flooding, cyclone context, fires and earthquakes with clear source timestamps and geographic coverage.
7. **Street Level and 3D:** add only providers with proven HCMC coverage and terms that allow the intended display.
8. **Hardening:** test desktop/mobile, provider failure, stale feeds, rate limits, attribution, load, security and production deploy.

## Verification boundary

- GitHub repository visibility: **PUBLIC — VERIFIED**.
- Main commit: `81b628ac59536cc04eda2c8ce2b79d25f8f74116`.
- Production deployment: **READY — VERIFIED**; HTTP 200; live HTML contains route controls and the camera section.
- Production route API: **VERIFIED** for one central-HCMC test (HTTP 200; 1,312.6 m; 129.5 s estimated; 7 manoeuvre steps) and malformed input (HTTP 400).
- Route panel elements are present in production HTML; a manual browser/device click-through remains **NOT PROVEN**.
- Driving route times are OSRM estimates from road-network data, **not live traffic**.
- Rate limiting is per client and per warm serverless instance, not a global cross-instance guarantee; do not treat the public demo integration as ready for mass traffic.
- Official camera portal link in Mercury Plus: **VERIFIED**.
- HCMC image/HLS embedding permission: **NOT VERIFIED**.
- Live camera media inside Mercury Plus: **NOT IMPLEMENTED**.
- Full GEV source port and feature parity: **NOT IMPLEMENTED**.
- Android, Hanoi and Купол remain out of scope.
