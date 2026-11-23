# HCMC public transit source audit — Mercury Plus

**Checked:** 2026-11-23  
**Scope:** public non-commercial browser pilot for Ho Chi Minh City only.

## Current decision

- MultiGo service and official status: **VERIFIED**.
- Real-time / estimated bus arrival capability in MultiGo: **VERIFIED**.
- Documented third-party API, GTFS-RT endpoint, API authentication method and reuse licence: **NOT FOUND / NOT VERIFIED**.
- Mercury Plus live bus feed: **NOT IMPLEMENTED**.
- Official MultiGo link in Mercury Plus: **ADDED**.
- Written authorization for public display in Mercury Plus: **NOT OBTAINED**.

## What is documented publicly

MultiGo describes itself as the official bus application for Ho Chi Minh City. Its public site states that the app provides route search, bus information and estimated bus arrival times. The FAQ describes the real-time arrival workflow inside the app and directs service-quality feedback to the public service operator at 1022 (press 9).

The Google Play listing identifies Go Labs Technology JSC as the developer and publishes:
- Support email: `contact@golabs.vn`
- Developer contact: `thanh@golabs.vn`
- Website: `https://golabs.vn/`
- Address: `1129/21 Lac Long Quan, Tan Binh District, Ho Chi Minh City, Vietnam`

These contacts are suitable for routing a technical data-access request. The support email does not by itself establish that Go Labs owns every underlying transit dataset or can grant reuse rights. Ask the company to identify the authorized data owner/operator where necessary.

## Official city data portal

The HCMC Data Portal describes the shared city data repository, dataset structure descriptions, technical guides and access methods. It links to a separate open-data portal for citizens, organizations and businesses. HCMC announced 142 open/shared datasets in Decision 4944/QĐ-UBND (2026). This does not imply that each dataset has a public real-time API or identical licensing conditions.

## What Mercury Plus must request

1. An official GTFS static package and/or GTFS-Realtime feed, SIRI feed, documented REST API or WebSocket, if available.
2. Scope of rights to display route geometries, stops, service alerts, vehicle positions and estimated arrivals in a public non-commercial website.
3. Whether data may be redistributed to browser clients, whether caching is allowed, and the approved refresh interval.
4. Required attribution, disclaimer and provider links.
5. Authentication, quota, IP/domain allowlisting, service availability and support contact.
6. The timestamp and meaning of each vehicle position (GPS observed time vs. server ingestion time), plus stale/offline behaviour.
7. Confirmation that the feed contains vehicle operational data only and does not expose passenger personal data, driver identity or customer device locations.

Do not reverse engineer private mobile-app endpoints, scrape app network calls, reuse private tokens, or display a vehicle feed without permission.

## Implementation gate after written approval

- Create a versioned provider adapter under `api/transit/` with a strict allowlist, timeout, quota and schema validation.
- Normalize route, stop, vehicle, alert and ETA objects.
- Keep source timestamp, ingestion timestamp and licence attribution on every feature.
- Show a last-updated indicator and a stale-feed warning.
- Load vehicles on demand and set the polling interval only after the operator states the permitted cadence.
- Do not store long-lived movement histories unless the licence explicitly permits it.
- No user tracking or collection of passenger data.
- Acceptance tests must validate a real vehicle update, the timestamp, stale state, API failure, quota response and source attribution.

## References

- [MultiGo official website](https://multigo.golabs.vn/en/)
- [MultiGo FAQ](https://multigo.golabs.vn/en/faq/)
- [MultiGo Google Play listing](https://play.google.com/store/apps/details?id=vn.golabs.multigo)
- [HCMC Data Portal](https://data.hochiminhcity.gov.vn/)
- [HCMC open-data catalogue announcement](https://shtp.hochiminhcity.gov.vn/danh-muc-du-lieu-mo-cua-thanh-pho-ho-chi-minh-962.htm)
