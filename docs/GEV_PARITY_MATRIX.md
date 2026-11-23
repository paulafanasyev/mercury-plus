# Mercury Plus — God's Eye View parity matrix

**Checked:** 2026-11-23  
**Target:** public, non-commercial browser pilot for Ho Chi Minh City, Vietnam  
**Upstream:** [bilawalsidhu/gods-eye-view](https://github.com/bilawalsidhu/gods-eye-view)  
**Mercury Plus:** [paulafanasyev/mercury-plus](https://github.com/paulafanasyev/mercury-plus)

## Executive status

Mercury Plus is still a small Leaflet application, not a port of God's Eye View. Production has an HCMC-centred OSM map, an official camera-portal link (images/video gated by prior written permission), user-triggered driving routes, on-demand Open-Meteo model weather, a USGS regional earthquake layer and sparse metadata-only Panoramax community-photo markers. The MultiGo bus app and historical-flood dataset are linked as discovered sources, but neither has a live/map integration yet. No upstream GEV application modules have been imported.

**Production verification:** Vercel deployment `dpl_4XjrE2jByuMWxm5iQ3m3fCM28wbL`, commit `df18c53d603ff7122f8da5f2a8af688f8e7076e8`, state **READY**. Public page returned HTTP 200; production HTML contains the camera portal, route panel, on-demand weather panel, MultiGo and historical-flood source links, and the regional earthquake controls. Production `/api/route` returned HTTP 200 for a central-HCMC test route; `/api/earthquakes` returned HTTP 200 with 10 USGS GeoJSON features. The UI/API are verified separately; full manual browser interaction on a physical device is still pending.

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
| Street Level photos / panoramas | **PARTIAL — METADATA-ONLY PANORAMAX MARKERS** — 98 accepted public items, 28 coordinate groups in the tested HCMC bbox; marker popups link to the original viewer | Panoramax STAC API; sample licence CC BY-SA 4.0, 100% of the filtered eligible sample by one contributor, captures 2026-01-15 to 2026-03-28. Content includes roads, buildings, parks and indoor shots, not all traffic views. KartaView/Mapillary/Google coverage not established | No images are fetched or re-hosted. Show capture time, author, per-item CC BY-SA and original viewer link. Panoramax blur configuration is optional and not exposed by public instance config, so embedding media stays disabled. This is sparse community imagery, not CCTV or continuous Street View | Medium |
| Mapped ALPR camera locations | **EXCLUDE** from the public pilot by default | Not needed to provide traffic context | Even location-only ALPR overlays can facilitate surveillance. No number-plate data, recognition, person identification or tracking is to be implemented | Exclude |
| Aircraft / ADS-B | **NOT IMPLEMENTED** | Tan Son Nhat and regional airspace context could be relevant | OpenSky has non-commercial research/education conditions and rate limits; adsb.lol is an alternate feed. Verify exact terms, HCMC coverage and freshness; keep provider credentials server-side if required | Medium |
| Vessels / AIS | **NOT IMPLEMENTED** | Potentially relevant to Saigon River and port approaches | AISStream registration/API key and provider conditions; verify local coverage, update cadence and redistribution/display rights | Medium |
| Satellites / orbital tracks | **NOT IMPLEMENTED** | Global overlay, not HCMC-specific | CelesTrak TLE/SATCAT feeds; orbit computation and clear “predicted position” label. Model/texture assets need separate provenance review | Low |
| Live transit vehicles | **NOT IMPLEMENTED** — official MultiGo app shows HCMC bus routes and real-time/estimated arrivals; no published third-party API or reuse permission verified. UI links to MultiGo, no vehicle markers are displayed | MultiGo is the city's official bus app; its public FAQ says the arrival estimate is in-app. Go Labs support contact is published in the app-store listing; 1022 press 9 is the public service feedback route | Request official GTFS/GTFS-RT, SIRI or documented API and written permission from Go Labs / the data owner. No mobile-app reverse engineering, endpoint scraping or user data extraction. Future feeds must be labelled by GPS observation time and stale status | High |
| Live rail / metro | **NOT IMPLEMENTED** | Metro Line 1 and future rail context are relevant | Need operator-published live positions or a documented feed; static schedules alone are not live tracking | Medium |
| Road traffic conditions / congestion | **NOT IMPLEMENTED** | High relevance | Official traffic-speed/incident feed or licensed provider (for example TomTom); a camera image is not a measured traffic-speed feed. Provider key, billing and storage rules may apply | High |
| Directions / routing | **PARTIAL — PRODUCTION API VERIFIED** — two-point driving route UI is deployed; same-origin API returned HTTP 200 with geometry and turn steps (1.31 km test route). Malformed coordinates returned HTTP 400. Manual map-click interaction test remains pending | Useful within HCMC | Fixed OSRM upstream, coordinate validation, timeout, no-store response, app User-Agent/Referer and a per-client in-memory 1 req/s guard per warm Vercel function instance. This is **not a global rate limit** across serverless instances. OSRM demo is best-effort with no SLA; use a shared global limiter or self-host OSRM before public scale. OSM/OSRM attribution is shown | High |
| OSM Places / place search | **NOT IMPLEMENTED** — search currently reports not connected | Useful for hospitals, transit stops, public facilities and local places | GEV uses a dedicated Overpass upstream. Need rate limits, user-triggered search, caching policy, language/alias handling and attribution; do not scrape commercial map products | High |
| Administrative boundaries | **NOT IMPLEMENTED** as a separate overlay | Important after HCMC's post-2025 boundary changes. Official shared/open-data portal publishes dataset descriptions and access methods; the open portal is a separate public access route | Select an individual authoritative current boundary record and verify version, data format, API/download, licence and update time. The existence of 142 open/shared datasets does not automatically clear every dataset for reuse | High |
| Roads, waterways, bridges and public facilities | **PARTIAL** — visible only as part of OSM base tiles, no selectable data overlays | Very relevant | Prefer individual HCMC Open Data/HCMGIS records. Every selected record needs its own licence, distribution/API, freshness and attribution review | High |
| Weather / wind / forecast | **PARTIAL — MODEL WEATHER CARD** — on-demand current model conditions for HCMC (temperature, feels-like, humidity, precipitation, wind and gusts) with model timestamp and grid-cell coordinates | Open-Meteo Forecast API, global model grid; current values are model estimates, not ground-station observations. Radar, lightning and a multi-day forecast layer are not implemented | Free endpoint only for non-commercial use; fewer than 10,000 calls/day, 5,000/hour, 600/minute. API data CC BY 4.0; visible Open-Meteo attribution required. No background polling; review paid terms before commercial use | High |
| Rain radar / satellite clouds / lightning | **NOT IMPLEMENTED** | Some global/regional satellite layers may work; GEV's US radar layers do not cover HCMC | Use regional/global imagery only after checking geographic coverage, refresh, licensing and attribution. Do not show US-only NOAA radar as a local HCMC observation | Medium |
| Flooding / rainfall / drainage context | **PARTIAL — SOURCE IDENTIFIED, NOT YET MAPPED** — historical archive of 425 geolocated events (2002–2026), plus flood recurrence road layer; no current sensor/API feed | Hardy & Radziute, DataSuds/IRD DOI 10.23708/8Y16HU. GeoPackage point layer EPSG:9210 and tabular file with 425 rows/22 attributes; archive assembled from 53 sources, mainly local media | CC BY-NC 4.0: attribution + link to licence, non-commercial use only. Extract GeoPackage points, transform EPSG:9210 to WGS84, reconcile 2025 ward boundaries and keep event date/cause/depth/source visible. Mark archive-only; never portray as current flooding or forecast. Still need an official live sensor/hydrology source | High |
| Tropical cyclone warnings | **NOT IMPLEMENTED** | Relevant to the Western Pacific | Prefer authoritative Vietnam/Western Pacific warning feeds; GEV NHC/CPHC US-centric products are not a substitute for local warnings | Medium |
| Active fires | **NOT IMPLEMENTED** | Regional context | NASA FIRMS API/key and current terms; label satellite detections and observation time, not ground-confirmed fires | Low |
| Earthquakes | **PARTIAL — PRODUCTION API + UI IMPLEMENTED** — user-triggered USGS layer, 10 verified events over 12 months in a 1,000 km radius, M≥3.5 | USGS ComCat FDSN GeoJSON API. No events were found within 500 km over the last 30 days; 10 M4.1–4.5 events were found within 1,000 km over the last 12 months, mainly central Vietnam | No key. Display magnitude/place/depth/provider time and USGS event-page link; show the search radius/window and catalogue generation time. Not a local warning, real-time sensor or forecast. API response is cached 15 min | Medium |
| Radio / audio | **NOT IMPLEMENTED** | Optional, not core to HCMC situational awareness | Radio Browser metadata is not a blanket licence for station audio; each stream has its own terms and copyright | Low |
| News / general events | **NOT IMPLEMENTED** | Could be useful only with vetted local feeds | Source attribution, publication time, geolocation confidence and misinformation controls needed | Low |
| US-specific restricted airspace, military/site overlays and other national packs | **EXCLUDE** unless a directly relevant, lawfully published HCMC source is found | Most source packs are not HCMC data | Never relabel US or other country data as HCMC. Avoid sensitive infrastructure and security-sensitive datasets | Exclude |
| Time slider, historical playback, trails, per-layer filters and context cards | **NOT IMPLEMENTED** beyond basic map controls/dialogs | Useful once real timestamped feeds exist | Requires a normalized data schema, server/client state, timestamps and a clear stale-data policy. Do not create playback from static snapshots as if they were continuous live history | Medium |
| Layer attribution, source/freshness panel and data status | **PARTIAL** — pending/offline labels and basic OSM attribution exist | Required across all live layers | Every layer must expose provider, coverage, data timestamp, update cadence, licence and source link | High |
| Backend provider proxies and secrets | **NOT IMPLEMENTED** — static site only | Needed for keys, rate-control and approved provider integrations | Add server-side endpoints only where provider terms permit. Never commit keys or use a generic open proxy. Restrict outbound hosts, request paths, payload sizes, cache and rate | Critical |
| Resilience, automated tests and runtime observability | **PARTIAL** — Vercel production deployment READY; no broad feature test suite is present | Required before claiming live parity | Add schema/unit tests, provider contract tests, browser smoke tests, stale/offline tests, request-volume checks and monitoring | Critical |

## Local data sources found — 2026-11-23

- **Official city data portal:** [data.hochiminhcity.gov.vn](https://data.hochiminhcity.gov.vn/) describes its shared data repository, dataset structures, technical guides and access methods; it links a separate open data portal for residents and businesses. The city announced 142 open/shared datasets under Decision 4944/QĐ-UBND. This is a catalogue discovery path, not a blanket licence for every dataset.
- **Public bus data:** MultiGo states it is the official HCMC bus app and documents real-time estimated arrivals; the app listing says the vehicle arrival feature is real-time. No third-party developer API or redistribution licence was found. Mercury Plus therefore links to the official app and records access as pending.
- **Historical flood archive:** Hardy & Radziute (2026), [DOI 10.23708/8Y16HU](https://doi.org/10.23708/8Y16HU), has 425 geolocated observations from 2002–2026, 22 attributes and 53 sources. Its GeoPackage point layer is EPSG:9210; a separate tabular file contains the 425 attribute rows. Licence CC BY-NC 4.0. Geometry conversion and validation are still required before map display.
- **Overpass:** A small read-only public query around central HCMC returned HTTP 502 because the public query server was at capacity. No production Places layer is enabled against that overloaded endpoint.



## Additional current-upstream capabilities — snapshot 2026-11-23

The upstream `main` branch was re-read on 2026-11-23. It contains 5,272 tracked paths and identifies itself as version 0.3.0. Its current README adds or explicitly documents the following capabilities beyond a simple map-layer list:

| Current upstream capability | Mercury Plus status | HCMC decision / next requirement |
|---|---|---|
| GNSS integrity / navigation-accuracy context | **NOT IMPLEMENTED** | adsb.lol and GPSJAM aggregation; no validated HCMC coverage/rights yet. An anomaly must never be labelled confirmed jamming or interference |
| Fire perimeter boundaries and containment | **NOT IMPLEMENTED** | Upstream WFIGS/NIFC source is US-focused; not a suitable HCMC layer. Find an authorized Vietnamese incident-perimeter source before use |
| Simulated road traffic driven by live flow speeds | **NOT IMPLEMENTED** | This is explicitly a simulation, not live positions of individual vehicles. TomTom speed/congestion feed requires key and current terms review; no HCMC traffic provider approved yet |
| Air quality / AQHI | **EXCLUDE current upstream provider** | Upstream first source is Environment and Climate Change Canada (Canada only). Find a Vietnam-capable source with a documented licence before implementing |
| Satellite scene / recent imagery and six-class orbital catalogue | **NOT IMPLEMENTED** | CelesTrak TLE/SATCAT and imagery catalogue; HCMC-specific scene availability and imagery rights must be checked per source |
| Military flights | **NOT IMPLEMENTED** | ADS-B-derived emergency/military classifications are provider-level labels and may be incomplete; exclude by default from the public HCMC pilot unless a clear, non-sensitive public-interest case is established |
| News and conflict panel | **NOT IMPLEMENTED** | GDELT plus optional World News API and Liveuamap. Local geolocation can be wrong; World News API terms require prior permission for caching and Liveuamap items require a paid API. Do not imply verified incident reports |
| Radio tuner / broadcaster directory | **NOT IMPLEMENTED** | Radio Browser is a station directory, not a blanket audio redistribution licence. Every station's stream rights and geolocation need review |
| Wildlife sightings | **EXCLUDE upstream regional pack** | Current README describes iNaturalist and Acartia/Salish Sea focus. No verified HCMC feed or permission/coverage is established |
| OpenAI/Gemini voice control and AI HUD | **NOT IMPLEMENTED** | Needs provider keys/OAuth, server-side ephemeral tokens, user-visible cost limits and privacy controls. OpenAI and Gemini usage can be metered. Not required for the first HCMC data pilot |
| Time rail, delayed playback, selected-entity trails and scene history | **NOT IMPLEMENTED** | Requires timestamped feeds, explicit retention/licensing policy and stale-data semantics. Static snapshots must not be presented as continuous history |
| Saved view/share links, annotations, cockpit/tool panels and MCP tools | **NOT IMPLEMENTED** | Significant UI/application architecture port; preserve state schema and permission boundaries when porting |
| Camera pose calibration, image/video modes and camera mesh scheduling | **NOT IMPLEMENTED** | GEV has provider-specific camera adapters and opt-in legal gates. HCMC camera content remains blocked by the official portal's prior-written-permission requirement |

### Current upstream stack and port size

- Upstream package version: `0.3.0`; package declares MIT, Vue 3, Pinia, CesiumJS, Vite 6, HLS.js, satellite.js, MapillaryJS, H3 and other spatial/media packages.
- Current engine requirement: Node `>=24.14.0 <25 || >=26 <27`; Mercury Plus has not been migrated to this stack.
- Upstream has 5,272 tracked tree entries, including approximately 4,301 under `src/`, 181 under `server/` and 194 scripts. A true source port is a separate migration project, not a small patch.
- Upstream has provider-specific server adapters for CCTV, traffic, transit, rail, flights, vessels, space, maps, weather, OpenAI, radio, Overpass and other sources. Copying a provider adapter does not confer rights to its data.
- Upstream's MIT code licence does not override data-provider terms. Only selected local packs may be carried after the file-level audit.

## Panoramax Street Level decision and implementation

- Live Panoramax search returned 100 public records in the tested HCMC bbox and 29 distinct coordinate groups. The inventory is concentrated: 98/100 records have the same contributor. It is a sparse sample, not a complete street-photo network.
- All 100 sample items declared **CC BY-SA 4.0**. The map returns metadata and an official viewer URL only; it does not embed or host the photos.
- Spot-checked photos include outdoor roads/vehicles, buildings, parks and indoor or unrelated subjects. Every point is labelled community imagery, not CCTV or live traffic.
- Panoramax documentation says privacy blurring is optional and depends on a blur-service configuration. The public instance config does not reveal whether that service is enabled, so embedding photos into Mercury Plus remains disabled.
- The metadata-only layer uses one marker per four-decimal coordinate group, displays contributor/capture time and links each item to its original Panoramax viewer.
- Audit: `docs/PANORAMAX_HCMC_AUDIT.md`.

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
- Main commit: `df18c53d603ff7122f8da5f2a8af688f8e7076e8`.
- Production deployment: **READY — VERIFIED** (`dpl_4XjrE2jByuMWxm5iQ3m3fCM28wbL`); HTTP 200; live HTML contains camera, route, weather, transit-source, flood-archive and earthquake controls.
- Production route API: **VERIFIED** (HTTP 200; 1,312.6 m; 129.5 s estimated; 7 manoeuvre steps); malformed coordinates: HTTP 400.
- Production Open-Meteo endpoint: **VERIFIED** (HTTP 200 test); browser weather interaction not manually tested on a physical device.
- Production USGS earthquake API: **VERIFIED** (HTTP 200; 10 GeoJSON events; last 12 months; radius 1,000 km; M≥3.5).
- Earthquake controls and route/weather controls are present in production HTML; actual marker rendering and physical-device click-through are **NOT PROVEN**.
- Driving route times are OSRM road-network estimates, **not live traffic**. The route API guard is per warm serverless instance, not a global cross-instance rate limit.
- Official camera portal link in Mercury Plus: **VERIFIED**. HCMC image/HLS embedding rights require prior written permission; **NOT OBTAINED**. Live camera media inside Mercury Plus: **NOT IMPLEMENTED**.
- MultiGo's public third-party API/reuse permission: **NOT VERIFIED**. Historical flood geometry has not been converted to Leaflet GeoJSON: **NOT IMPLEMENTED**.
- Full GEV source port and feature parity: **NOT IMPLEMENTED**.
- Android, Hanoi and Купол remain out of scope.
