# Mercury Plus — port plan and initial license gate

## Product scope
Mercury Plus is the Ho Chi Minh City–adapted browser edition based on the permitted source-code foundation of [God's Eye View](https://github.com/bilawalsidhu/gods-eye-view).

This repository is a separate product. Preserve upstream attribution and required notices. Do not imply affiliation, endorsement, or trademark rights in God's Eye View.

## Hard scope boundaries
- Browser application only.
- Ho Chi Minh City (Thành phố Hồ Chí Minh), Vietnam is the initial geographic focus.
- No Android application or Android build work.
- Do not modify or incorporate Hanoi project work.
- Do not modify or incorporate the game “Купол”.

## Upstream code permission
The upstream repository's LICENSE grants MIT rights to its source code, subject to retaining the copyright and permission notice. The upstream README identifies God's Eye View as a trademark and states that it is used under license by its named parties. Mercury Plus must use its own product identity and must not reuse upstream branding, marks, promotional media, or imply endorsement.

## Initial third-party rights gate — NOT CLEARED FOR BLIND COPYING
The upstream LICENSE and DATA_SOURCES.md expressly exclude third-party data/assets from the MIT grant. Each source and bundled dataset must be individually reviewed before inclusion.

Known examples requiring removal, replacement, or separate permission before any commercial use:
- TeleGeography Submarine Cable Map: CC BY-NC-SA 3.0; non-commercial only.
- Bhote Koshi event imagery/derived river coordinates: CC BY-NC 4.0; non-commercial absent separate permission.
- OpenSky Network: non-commercial research/education terms; do not assume commercial deployment rights.
- Google Maps / Photorealistic 3D Tiles / Street View / Places: proprietary Google Maps Platform terms, own credentials, billing and attribution requirements.
- ECMWF: CC BY 4.0 plus ECMWF Terms of Use and required attribution/modification/disclaimer.
- OpenStreetMap-derived databases: ODbL 1.0 obligations, attribution and possible share-alike.
- Mapillary, KartaView, Panoramax imagery: per-provider/per-image licenses and attribution must be preserved.
- adsbdb route data: upstream documentation says some route data may not be copied, published, or incorporated without explicit permission.
- NASA ISS model/imagery: public-domain status does not remove NASA branding/endorsement restrictions or third-party marks embedded in textures.

This list is preliminary, not exhaustive. The full upstream DATA_SOURCES.md and every bundled asset's provenance must be reviewed before importing the corresponding files. No third-party dataset is cleared merely because it sits in an MIT repository.

## Ho Chi Minh City adaptation work
1. Inventory every city-specific source, default camera, search alias, demo scene, bundled dataset, and hard-coded location in upstream code.
2. Build an HCMC source matrix: provider, geographic coverage, freshness, API/CORS/authentication requirements, license, attribution, retention/caching rules, rate limits, and commercial-use status.
3. Prefer authoritative/open Vietnam and HCMC sources where their terms permit the intended use. Do not present simulated, inferred, stale, or approximate layers as live observations.
4. Remove or disable unsupported US-city-specific defaults and scenes rather than relabeling them as HCMC data.
5. Add HCMC-centered browser defaults, place search aliases, and locally relevant layers only after source and rights verification.

## Verification gates
- [ ] Confirm target repository visibility is Public as originally requested.
- [ ] Preserve upstream MIT copyright and license notices for imported code.
- [ ] Complete file-by-file third-party data/asset provenance and license audit.
- [ ] Exclude non-commercial/restricted data unless separately licensed and documented.
- [ ] Verify every displayed source attribution and any required share-alike notices.
- [ ] Browser-only build and runtime checks; no Android work.
- [ ] Verify HCMC coverage, timestamps, stale/unavailable states, and attribution in the browser.

## Current status (2026-11-21)
- Repository exists, default branch `main`; initial project plan and audit documents are committed.
- GitHub reports repository visibility as **Private**, contrary to the original Public requirement. No repository-visibility write action is available in the connected GitHub integration; this remains an owner-side setting.
- Upstream `bilawalsidhu/gods-eye-view` main was inspected at commit `ae212e5b631ed16cbe3d605abecdf105a1be8df3`; tree scan reports 5,075 entries.
- Technical stack and scripts identified: Vue 3, Pinia, CesiumJS, Vite; `npm run build`, `npm test`, `npm run test:track` and additional QA gates.
- First-pass third-party rights triage and mandatory exclusions documented in `docs/UPSTREAM_AUDIT.md`.
- HCMC source-discovery catalogue documented in `docs/HCMC_DATA_CATALOG.md`; candidate sources remain PENDING individual licence/endpoint verification.
- No source code or third-party assets have been copied. No build, browser runtime, or Vercel deployment has been performed.
- Next critical action: establish a faithful upstream source import (preserving MIT notices and history where possible), then apply the path-level exclusion manifest before adding HCMC layers.
