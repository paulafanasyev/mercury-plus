# Mercury Plus — public pilot plan

## Product mode
Mercury Plus is a **public, non-commercial browser pilot** for exploring publicly available geographic and infrastructure information about Ho Chi Minh City (Thành phố Hồ Chí Minh), Vietnam. It is not a commercial service, emergency-response system, surveillance product, or source of safety-critical decisions.

The pilot should be useful and visibly functional, while clearly distinguishing verified live data, delayed data, static reference layers, demonstrations, and unavailable sources.

## Scope boundaries
- Browser application only; no Android application or Android build work.
- Initial geographic focus: Ho Chi Minh City.
- Do not modify or incorporate Hanoi project work.
- Do not modify or incorporate the game “Купол”.
- Use Mercury Plus identity; do not reuse upstream branding, marks, promotional media, or imply endorsement.

## Upstream code
The upstream [God's Eye View](https://github.com/bilawalsidhu/gods-eye-view) MIT license permits reuse of source code subject to retaining the copyright and permission notice. This permission does not automatically cover bundled or runtime third-party datasets, imagery, models, APIs, or other assets. Preserve upstream notices and document modifications.

## Pilot data and licensing policy
The current target is non-commercial public demonstration. A source marked Non-Commercial may be considered for the pilot only when:
1. The pilot's actual use is consistent with the source's non-commercial definition and terms.
2. Required attribution, share-alike, notices, and modification disclosures are implemented.
3. Redistribution, caching, extraction, and API-use rules are respected.
4. The exact dataset or asset provenance is recorded.

Public access does not cancel licence conditions. Do not redistribute a source file or dataset where the provider only permits viewing/API access. Do not assume a provider's general portal announcement clears every dataset. Proprietary APIs (for example Google Maps Platform) still require their own credentials and compliance. Any source with unclear terms stays disabled or is represented only by a clearly labelled placeholder.

Preliminary source treatment:
- TeleGeography Submarine Cable Map (CC BY-NC-SA 3.0): potentially eligible only for a strictly non-commercial pilot, subject to exact asset provenance, attribution, share-alike and redistribution terms; not cleared for inclusion yet.
- Bhote Koshi event material (CC BY-NC 4.0): non-commercial licence does not make this Nepal-specific material relevant to HCMC; exclude from the HCMC pilot.
- OpenSky Network: assess exact current access terms and permitted use; no assumption of commercial rights. Use only if the pilot complies with its non-commercial restrictions and required attribution.
- Google Maps / Photorealistic 3D Tiles / Street View / Places: proprietary terms, own credentials and required billing/attribution; do not bundle or scrape.
- ECMWF: CC BY 4.0 plus applicable ECMWF terms and required attribution/modification/disclaimer.
- OpenStreetMap-derived databases: ODbL 1.0 obligations, attribution and applicable share-alike.
- Mapillary, KartaView, Panoramax imagery: verify provider and per-image terms, attribution, caching and display requirements.
- adsbdb route data: do not copy, publish, or incorporate route data where provider terms prohibit it.
- NASA ISS model/imagery: check model-specific provenance, third-party marks, and NASA branding/endorsement restrictions.

This is a first-pass triage, not legal clearance. Keep every unverified source out of the enabled pilot layers.

## Pilot experience — target
- HCMC-centered map with clear city context and useful zoom levels.
- Layer controls grouped by category: base map, administrative boundaries, roads/waterways, public infrastructure, public transport, weather, rainfall/flood context.
- Search for places and geographic features using Vietnamese and English names and common aliases (TP.HCM, Thành phố Hồ Chí Minh, Ho Chi Minh City, Saigon/Sài Gòn).
- Each layer shows provider, attribution, last-updated time or “update time unavailable”, coverage, and a status: LIVE, DELAYED, STATIC, DEMO, or UNAVAILABLE.
- A source panel explains data limitations and links to original providers.
- Empty/error states must be explicit; never silently substitute fabricated or stale data.
- No individual face recognition, person tracking, or personal surveillance features.

## HCMC source verification
Potential official discovery portals:
- HCMC Open Data: https://data.hochiminhcity.gov.vn/
- HCMGIS: https://portal.hcmgis.vn/
- HCMC Geoportal: https://geoportal-stnmt.tphcm.gov.vn/geonetwork/srv/eng/catalog.search
- Planning GIS: https://gisxaydung.tphcm.gov.vn

These are discovery candidates, not blanket data permissions. For each selected layer, record the exact dataset record, owner, API/download URL, coverage, update cadence, format, access/authentication, licence/terms, attribution, retention/cache rules, and verification date. Prefer official HCMC/Vietnam sources where terms and technical access are clear.

## Technical implementation sequence
1. Import a minimal, traceable upstream code foundation and retain required MIT notices.
2. Build a path-level allowlist/denylist for code, datasets, imagery, models, and secrets before enabling upstream features.
3. Remove unsupported city demos and restricted assets; do not relabel another city's data as HCMC.
4. Implement HCMC default view, search aliases, layer registry, attribution/source panel, and explicit data-status badges.
5. Connect only individually verified HCMC sources; keep the rest as disabled placeholders.
6. Run browser build, tests, source-attribution checks, and browser runtime smoke tests.
7. Deploy a public pilot only after repository visibility, source permissions, secrets, and runtime checks are confirmed.

## Verification gates
- [ ] Repository visibility set to Public.
- [ ] Upstream MIT notices retained.
- [ ] Per-file/source provenance and terms documented.
- [ ] All enabled layers individually cleared for this non-commercial pilot.
- [ ] Required attribution and share-alike notices visible in the UI.
- [ ] HCMC coverage, timestamps, stale/error states verified.
- [ ] Browser build and tests pass.
- [ ] Browser runtime smoke test passes.
- [ ] Vercel deployment and public URL verified.

## Current verified status — 2026-11-23

- GitHub repository `paulafanasyev/mercury-plus`: **PUBLIC — VERIFIED** by GitHub repository metadata.
- The deployed Vercel pilot was previously verified READY at `https://mercury-plus.vercel.app/`; the deployed page served HTTP 200 and the Leaflet/OSM map loaded. This is a static pilot shell, not the upstream God's Eye View application.
- Current source remains a small static Leaflet application. It has no imported upstream application modules and no live HCMC transport, weather, flood, infrastructure, or camera data feeds.
- The camera UI now links to the official HCMC traffic-camera map. Camera snapshots/video are intentionally not embedded pending written permission or clear official reuse/framing terms.
- HCMC camera metadata endpoints have been observed in community synchronization code, but that does not establish official API support or permission to republish metadata/images/video.
- Upstream God's Eye View code is MIT-licensed, but its own source manifest makes clear that third-party data/assets have separate conditions; some CCTV providers are disabled unless written agreements exist.
- This branch contains the first camera-source permission gate and audit. No full upstream source import, camera-feed integration, npm build, or browser runtime test is claimed.
- Next blockers: obtain operator permission/terms for public third-party embedding; select a compliant camera catalogue and direct-image/HLS mode; then implement and test an on-demand camera layer. In parallel, continue the upstream port as a separate major milestone.
