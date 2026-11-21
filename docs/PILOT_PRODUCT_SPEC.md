# Mercury Plus — HCMC public pilot specification

## Purpose
A public, non-commercial browser pilot that lets visitors explore geographic and public-infrastructure context for Ho Chi Minh City. This is an exploratory information interface, not an emergency service or safety-critical decision tool.

## MVP screens
1. **Map workspace** — HCMC default extent, zoom controls, layer switcher, place search, source/status panel.
2. **Layer catalogue** — grouped layers with provider, coverage, update cadence, licence/attribution and status.
3. **About and limitations** — pilot purpose, data freshness caveats, source links, contact/feedback route.

## Initial layer groups
- Base map and administrative boundaries.
- Roads, waterways and bridges.
- Public facilities and infrastructure.
- Public transport.
- Weather and rainfall.
- Flood/drainage context.

The current map uses OpenStreetMap standard raster tiles with visible attribution. The public tile service is best-effort and has no SLA; follow its tile usage policy, cache directives, referer requirements and no-bulk-download rule. Place search is intentionally not connected until a geocoder is selected and its usage policy is implemented.\n\nA group is not considered implemented merely because its menu exists. Each enabled layer must load a real source and display provenance. If no suitable source is verified, show it as “Not connected yet” and keep it disabled.

## Data status vocabulary
- **LIVE** — provider is queried successfully and the response freshness is known.
- **DELAYED** — provider data is real but not current; show its timestamp.
- **STATIC** — a published reference dataset, with release/update date.
- **DEMO** — illustrative sample data, never presented as observation.
- **UNAVAILABLE** — source failed or access is not configured; do not substitute invented values.

## Non-commercial pilot rules
- No payment, subscription, advertising, or commercial customer claims in this pilot.
- Non-commercial datasets may be considered only after checking exact source terms and implementing all attribution/share-alike obligations.
- Do not scrape proprietary map products or bundle data where redistribution is not permitted.
- Keep API credentials server-side; never commit secrets.
- Avoid personal data, face recognition, and individual tracking.

## Acceptance criteria
- Browser loads without a blank screen or fatal console error.
- Initial map is centered on HCMC and search accepts Vietnamese and English place names.
- Layer switcher reflects actual connected state.
- Every enabled layer exposes its source and freshness.
- Failed and stale sources are visible as such.
- No unrelated city demo is mislabeled as HCMC.
- Build and tests pass; deployed URL is checked in a real browser.

## Out of scope
Android, Hanoi projects, “Купол”, emergency dispatch, predictive claims, personal surveillance, and commercial monetization.
