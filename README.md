# Mercury Plus

**Public non-commercial pilot — Ho Chi Minh City, Vietnam.**

Mercury Plus is an experimental browser map workspace for Ho Chi Minh City. It provides an OpenStreetMap street map and optional Esri World Imagery satellite imagery. Visitors may enter their own ArcGIS API key in the browser to activate satellite tiles; the key is stored locally in that browser and is not sent to the Mercury Plus server. Other city layers remain disabled until their source, access and licence conditions are verified.

## Current pilot
- HCMC-centered interactive map.
- OpenStreetMap street map with visible attribution.
- Optional Esri World Imagery satellite/aerial layer using a visitor-provided ArcGIS API key.
- Per-browser API-key settings: the key is stored in localStorage on the visitor's device and can be replaced or deleted.
- Responsive layer catalogue and explicit pending/offline states.
- No live public-transport or infrastructure feed is connected. MultiGo is linked as the official HCMC bus app; a third-party feed requires operator authorization. A CC BY-NC 4.0 historical flood dataset (425 geolocated cases, 2002–2026) has been identified, but its GeoPackage geometry is not yet converted into the map. Current HCMC model weather conditions are available on demand through Open-Meteo; values are model estimates, not station readings or hazard alerts. The camera catalogue is not embedded; official portal terms require prior written permission for reuse.
- User-triggered driving directions between two map points via a bounded same-origin API endpoint and the OSRM demo server; one route request per action, with OSRM/OSM attribution and no live-traffic claim.
- On-demand HCMC weather conditions from Open-Meteo with visible timestamp and attribution; no background polling or API key.
- Place search is intentionally disabled until an appropriate geocoding provider and usage controls are selected.

## Run locally
Open `index.html` from a local static web server. The map requires an internet connection to load the Leaflet library and OSM tiles.

## Deploy
This repository includes a static `vercel.json` configuration. A deployment is not considered verified until the Vercel build/deployment and a real browser smoke test pass.

## Data and legal notes
- The upstream God's Eye View code is MIT-licensed; preserve its required notices for any imported code.
- Third-party data and assets have separate terms and are not automatically covered by the upstream MIT licence.
- Esri Static Basemap Tiles require an API key with `premium:user:staticbasemaptiles`; visitors must configure their own key and restrict it by HTTP referrer in their Esri account. Browser keys are visible to the browser and must not be treated as server secrets. Review Esri pricing, quotas and attribution requirements before use.
- OpenStreetMap attribution: © OpenStreetMap contributors. OSM data is available under the ODbL; the standard tile service has a separate usage policy.
- Open-Meteo free API is limited to non-commercial use (less than 10,000 calls/day, 5,000/hour and 600/minute); API data is CC BY 4.0 and requires a nearby attribution link. If the project becomes commercial or needs higher volumes, disable the free endpoint and review the paid terms.
- The pilot is informational and experimental, not for emergency or safety-critical use.

## Project documents
- [Pilot product specification](docs/PILOT_PRODUCT_SPEC.md)
- [Upstream rights audit](docs/UPSTREAM_AUDIT.md)
- [HCMC data catalogue](docs/HCMC_DATA_CATALOG.md)
- [Port plan and verification gates](MERCURY_PLUS_PORT_PLAN.md)
- [HCMC camera source and permission audit](docs/CAMERA_SOURCE_AUDIT.md)
- [Bilingual camera permission request](docs/CAMERA_PERMISSION_REQUEST.md)
- [God's Eye View feature parity matrix](docs/GEV_PARITY_MATRIX.md)
- [Production routing verification](docs/ROUTING_VERIFICATION.md)
- [Open-Meteo source and weather-layer audit](docs/WEATHER_SOURCE_AUDIT.md)
- [Public-transit source and API-access audit](docs/TRANSIT_SOURCE_AUDIT.md)
- [Bilingual public-transit data-access request](docs/PUBLIC_TRANSPORT_ACCESS_REQUEST.md)
- [Historical HCMC flood archive audit](docs/HISTORICAL_FLOOD_ARCHIVE_AUDIT.md)
