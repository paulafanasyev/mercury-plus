# Upstream audit — God's Eye View

Audit date: 2026-11-21
Upstream: https://github.com/bilawalsidhu/gods-eye-view
Audited ref: `main` at `ae212e5b631ed16cbe3d605abecdf105a1be8df3`
Audited tree: 5,075 entries (5,075 total tree entries reported by GitHub; includes directories and files).
Target: `paulafanasyev/mercury-plus`

## Executive result

**Code reuse permission: VERIFIED at the upstream LICENSE level.** The upstream LICENSE contains an MIT grant for source code, subject to retaining its copyright and permission notice.

**Third-party data/assets: NOT CLEARED as a blanket set.** The upstream LICENSE explicitly says the MIT grant does not cover third-party data or assets. DATA_SOURCES.md is the authoritative per-source inventory and must travel with a file-level allow/deny decision.

**HCMC-specific data pack: NOT FOUND in the upstream tree.** No paths matching HCMC, Ho Chi Minh, or Vietnam were found in the 5,075-entry tree scan. Several defaults and fixture packs are city-specific (notably Austin, Houston, Quebec and a Nepal event scene) and cannot simply be relabeled for HCMC.

**Build/runtime: NOT TESTED in Mercury Plus.** The target currently contains documentation only. No application source has been copied; no install, build, browser test, or Vercel deployment has been run.

## Technical shape of upstream

- Package: `gods-eye-view`, version `0.3.0`.
- Browser stack: Vue 3, Pinia, CesiumJS, Vite.
- Build: `npm run build` → `vite build`.
- Unit tests: `npm test`; track regression: `npm run test:track`.
- Additional QA gates include `npm run qa:conformance`, `npm run qa:stories`, `npm run qa:street-level`, `npm run qa:data-library`.
- Runtime includes server-side provider proxies; secrets must remain server-side. A static-only Vercel build will not automatically provide the complete upstream server behavior.

## Mandatory exclusions before commercial redistribution

1. `src/data/local_data/telegeography_submarine_cables/` — CC BY-NC-SA 3.0; exclude unless a commercial licence is obtained.
2. `public/events/bhote-koshi-2026/`, `src/data/bhoteKoshiFloodPath.js`, and dependent Nepal scene registrations/imports — Vantor/GeoPera material under CC BY-NC 4.0; exclude unless separate permission is obtained. Removing only the public event images is insufficient.
3. OpenSky Network live feed — documented non-commercial research/education terms; require a separate written agreement before commercial operation or disable it.
4. Google Maps Platform (Photorealistic 3D Tiles, Places, Geocoding, Street View) — proprietary terms, own credentials, billing, usage restrictions and attribution; disable until Mercury Plus has its own compliant configuration and verified billing/terms.
5. TeleGeography, Mapillary, KartaView, Panoramax, Planespotters and Open Vessel Photos imagery/data — source-specific terms, attribution, linking/hotlinking and caching restrictions apply; do not copy or proxy indiscriminately.
6. adsbdb route enrichment — upstream records an explicit restriction on copying/publishing/incorporating some route data without permission; disable route fields until permission is resolved.
7. NASA ISS model — public-domain status in the US does not grant NASA/partner trademark or endorsement rights; preserve provenance, inspect embedded marks and follow NASA media guidance. Treat as a separate asset clearance.
8. All other bundled datasets and live feeds — individually preserve licence, provenance, attribution, modification notice, geographic coverage, API terms, caching limits and commercial-use status.

## Potentially reusable with conditions

- MIT source code, retaining original copyright and permission notice.
- Project-generated procedural fleet models only where their per-file provenance confirms they are maintainers' own work and the MIT grant covers them.
- Natural Earth public-domain data, with courtesy attribution.
- NOAA/U.S. public-domain products, only within their documented coverage and disclaimer rules.
- OSM-derived databases under ODbL 1.0, with attribution and applicable share-alike obligations.
- ECMWF Open Data under CC BY 4.0 plus ECMWF Terms of Use, modification notice and disclaimer.
- CC0 and public-domain data, with any requested acknowledgement.

This is a first-pass rights triage, not a legal opinion and not a completed per-file audit. Before copying, generate a path manifest and classify every source/data/asset file; review package-lock licences and every folder README as well.

## HCMC adaptation findings

- No Vietnam/HCMC-specific source or city pack was found in the upstream tree scan.
- Upstream includes U.S.-specific defaults and data (Austin fixture/default config, Houston camera provider, U.S. Census packs, DataSF neighborhoods, NOAA/NWS products) and a Nepal event scene.
- Global sources can remain global only after verifying geographic coverage and terms. A US-only weather/camera/municipal layer must be disabled or replaced, not presented as HCMC coverage.
- Initial local-source candidates and the legal/technical validation queue are in [HCMC_DATA_CATALOG.md](HCMC_DATA_CATALOG.md).

## Next engineering gates

1. Obtain/verify a full source checkout/import method preserving Git history and MIT notices; do not attempt a lossy partial copy of thousands of files via individual contents calls.
2. Produce a generated path-level licence manifest from upstream `DATA_SOURCES.md`, folder READMEs, `THIRD_PARTY_NOTICES.md`, package-lock and provider code.
3. Import only the allowed source-code baseline and individually cleared assets/data.
4. Remove prohibited/restricted data together with imports, registrations, scenes, tests and build references.
5. Add an HCMC region profile and local data sources only after endpoint, terms, freshness, coverage, CORS/auth, cache and attribution checks.
6. Run upstream unit/build/QA checks and browser runtime verification; then deploy to Vercel and verify the live URL.

## Evidence links

- [Upstream LICENSE](https://github.com/bilawalsidhu/gods-eye-view/blob/main/LICENSE)
- [Upstream DATA_SOURCES.md](https://github.com/bilawalsidhu/gods-eye-view/blob/main/DATA_SOURCES.md)
- [Upstream THIRD_PARTY_NOTICES.md](https://github.com/bilawalsidhu/gods-eye-view/blob/main/THIRD_PARTY_NOTICES.md)
- [Upstream SECURITY.md](https://github.com/bilawalsidhu/gods-eye-view/blob/main/SECURITY.md)
- [Upstream CONTRIBUTING.md](https://github.com/bilawalsidhu/gods-eye-view/blob/main/CONTRIBUTING.md)
