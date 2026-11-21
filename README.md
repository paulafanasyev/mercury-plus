# Mercury Plus

**Public non-commercial pilot — Ho Chi Minh City, Vietnam.**

Mercury Plus is an experimental browser map workspace. The current prototype connects an OpenStreetMap base map and presents a catalogue of planned city data layers. Other layers remain disabled until their source, access and licence conditions are verified.

## Current pilot
- HCMC-centered interactive map.
- OpenStreetMap raster base layer with visible attribution.
- Responsive layer catalogue and explicit pending/offline states.
- No connected transport, weather, flood, CCTV or infrastructure feeds yet.
- Place search is intentionally disabled until an appropriate geocoding provider and usage controls are selected.

## Run locally
Open `index.html` from a local static web server. The map requires an internet connection to load the Leaflet library and OSM tiles.

## Deploy
This repository includes a static `vercel.json` configuration. A deployment is not considered verified until the Vercel build/deployment and a real browser smoke test pass.

## Data and legal notes
- The upstream God's Eye View code is MIT-licensed; preserve its required notices for any imported code.
- Third-party data and assets have separate terms and are not automatically covered by the upstream MIT licence.
- OpenStreetMap attribution: © OpenStreetMap contributors. OSM data is available under the ODbL; the standard tile service has a separate usage policy.
- The pilot is informational and experimental, not for emergency or safety-critical use.

## Project documents
- [Pilot product specification](docs/PILOT_PRODUCT_SPEC.md)
- [Upstream rights audit](docs/UPSTREAM_AUDIT.md)
- [HCMC data catalogue](docs/HCMC_DATA_CATALOG.md)
- [Port plan and verification gates](MERCURY_PLUS_PORT_PLAN.md)
