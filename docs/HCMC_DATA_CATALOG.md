# Ho Chi Minh City data catalogue — Mercury Plus

Status date: 2026-11-21
Scope: browser experience centred on Ho Chi Minh City, Vietnam.

**Important:** a portal listing or a government announcement that data is open does not by itself prove that a particular layer's dataset, API endpoint, licence, attribution, or commercial reuse rights are cleared. Every layer remains **PENDING** until its actual record/metadata/terms and live endpoint are inspected.

## Candidate official sources

| Candidate | Evidence currently available | Intended use | Status / gate |
|---|---|---|---|
| HCMC Open Data portal — https://data.hochiminhcity.gov.vn/ | City portal announced 142 shared/open datasets under Decision 4944/QĐ-UBND dated 2026-08-08. Portal says it provides dataset descriptions, structure and technical access instructions. | Search for transport, public infrastructure, environment, city services and administrative geography. | **PENDING** — inspect each dataset record and its actual reuse terms; do not infer universal open licensing. |
| HCMGIS Spatial Data Sharing Platform — https://portal.hcmgis.vn/ | Public portal currently advertises 73 layers, 9 maps and downloadable standard formats. | HCMC GIS layers and urban infrastructure. | **PENDING** — per-layer rights, public download access, API formats, update frequency and attribution not yet established. |
| HCMC Geoportal — https://geoportal-stnmt.tphcm.gov.vn/geonetwork/srv/eng/catalog.search | Official natural-resources/environment geospatial catalogue; search and metadata records are exposed. | Land, environment, hydrology and geospatial reference layers. | **PENDING** — inspect individual records, distribution links, access restrictions and licences. |
| HCMC official urban planning GIS — https://gisxaydung.tphcm.gov.vn | Official city planning database/API is referenced in a 2026 city document. | Planning boundaries and urban development context. | **PENDING** — API terms, credentials, data access and redistribution rights need confirmation. |

## Legal baseline

- HCMC's 2026 open-data announcement describes 142 open/shared datasets and points users to the city data portal. This is a discovery lead, not proof that every record can be redistributed or used commercially.
- Decision 30/2026/QĐ-UBND is reported to allow free access and commercial or non-commercial use of open data, subject to law and data-specific restrictions. Obtain the authoritative legal text and match the selected dataset to the official open-data catalogue before enabling it.
- Personal data, protected infrastructure, security-sensitive information, and records restricted by other laws must not be ingested merely because a portal is reachable.
- For OpenStreetMap-derived data, use ODbL 1.0 and comply with attribution/share-alike obligations. Keep OSM provenance distinct from government datasets.

## Layer priority for first browser milestone

1. City geography and administrative boundaries — official HCMC or Natural Earth/OSM only after verifying source and terms.
2. Roads, waterways, bridges and public infrastructure — HCMGIS/HCMC open-data candidates; OSM fallback with ODbL compliance.
3. Public transport — official HCMC transport datasets and live feeds only if the operator publishes usable API terms and freshness metadata.
4. Weather — global/Asia-capable provider with documented coverage for southern Vietnam; no U.S.-only NOAA radar or NHC storm layers presented as local HCMC observations.
5. Flooding, rainfall and drainage — official HCMC/environment sources only; clearly label forecast/modelled/observed values and timestamps.
6. Public cameras — only official public camera endpoints with explicit reuse permission; no scraping, no private feeds, no access-control circumvention.

## Required source record before implementation

For each dataset/provider, record:
- Provider and canonical source URL/API endpoint.
- Exact dataset title, ID, release date and geographic extent.
- Licence and authoritative terms URL; commercial-use status.
- Attribution text and whether modifications must be declared.
- API key/authentication, CORS, rate limits and availability.
- Update cadence, timestamp semantics and stale-data handling.
- Caching, retention, redistribution and derivative-database obligations.
- Personal/sensitive data screening.
- Browser/server architecture and secret-handling requirements.
- A repeatable probe and evidence of actual HCMC coverage.

## Initial HCMC view defaults

- Geographic centre: Ho Chi Minh City (approximate city-centre camera only; exact camera coordinates to be set after the administrative-area definition is confirmed).
- Default view must not claim to represent the enlarged post-2025 administrative boundary until the exact boundary dataset is selected and verified.
- Search aliases: Ho Chi Minh City, Thành phố Hồ Chí Minh, TP.HCM, Saigon, Sài Gòn.
- UI language: retain upstream language architecture; Vietnamese and English should be prioritised for local usability. Do not remove other languages without product review.
- Browser only. No Android package or Android build.

## Research references

- HCMC open-data catalogue announcement: https://shtp.hochiminhcity.gov.vn/danh-muc-du-lieu-mo-cua-thanh-pho-ho-chi-minh-962.htm
- HCMGIS platform: https://portal.hcmgis.vn/
- HCMC Geoportal: https://geoportal-stnmt.tphcm.gov.vn/geonetwork/srv/eng/catalog.search
- HCMC planning GIS API reference: https://gisxaydung.tphcm.gov.vn
- HCMC legal portal reference for Decision 30/2026/QĐ-UBND: https://vbpl.freshdesk.com/support/solutions/articles/16000237700-quy%E1%BA%BFt-%C4%91%E1%BB%8Bnh-30-2026-q%C4%91-ubnd-ng%C3%A0y-23-05-2026-quy-ch%E1%BA%BF-qu%E1%BA%A3n-l%C3%BD-k%E1%BA%BFt-n%E1%BB%91i-v%C3%A0-chia-s%E1%BA%BB-d%E1%BB%AF-li%E1%BB%87u-s%E1%BB%91-c%E1%BB%A7a-th%C3%A0nh-ph
