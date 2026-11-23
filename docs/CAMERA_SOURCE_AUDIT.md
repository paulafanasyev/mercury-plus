# HCMC public camera source audit

**Checked:** 2026-11-23  
**Scope:** Mercury Plus public non-commercial browser pilot for Ho Chi Minh City only.

## Decision

**Camera feed embedding: NOT CLEARED.**  
**Official camera portal link: VERIFIED as a public source reference.**  
**Camera catalogue inside Mercury Plus: NOT IMPLEMENTED.**  
**Snapshot/HLS display inside Mercury Plus: NOT IMPLEMENTED.**

The UI links directly to the official city traffic-camera map. It does not copy the third-party camera catalogue, proxy images, cache frames, or embed streams. Public access to a camera image is not, by itself, a licence to re-host, frame, cache, or redistribute it.

## What God's Eye View actually does

The upstream project's CCTV Mesh is a provider registry, not a universal camera endpoint. Its README describes camera location packs from many individual transport operators. Its `.env.example` has provider-specific switches and limits. Some providers are explicitly disabled unless written permission is held:
- NYC DOT: enable only when a NYC DOT data-sharing agreement is held.
- Florida FL511: personal use only; other use, including public deployment, requires FDOT's express written consent.
- Houston TranStar: disabled unless TxDOT written permission is held; source terms prohibit copying, distributing, or framing images without permission.
- Ottawa: requires a city access certificate.
- Other providers have their own keys, access certificates, or unconfirmed image licences.

This is important: feature parity does not mean copying every provider's URLs and turning them on. Each source is gated separately.

References:
- [God's Eye View README — CCTV Mesh](https://github.com/bilawalsidhu/gods-eye-view#-cctv-mesh)
- [God's Eye View .env.example — provider switches and permission gates](https://github.com/bilawalsidhu/gods-eye-view/blob/main/.env.example)
- [God's Eye View DATA_SOURCES.md — independent third-party terms](https://github.com/bilawalsidhu/gods-eye-view/blob/main/DATA_SOURCES.md)

## HCMC sources found

### 1. Official city traffic portal

- Portal: [giaothong.hochiminhcity.gov.vn/Map.aspx](https://giaothong.hochiminhcity.gov.vn/Map.aspx)
- A 2025 local news report confirms the city traffic portal publishes road-camera images for residents to monitor traffic.
- Community synchronization code reports a catalogue request against the portal's map page and describes image URLs in the form `https://giaothong.hochiminhcity.gov.vn/render/ImageHandler.ashx?id=<camera-id>`.
- The same community code reads `VideoStreaming` and `VideoUrl` fields and reports HLS URLs for some cameras. This is **observed implementation evidence from a third party**, not official API documentation.
- A third-party list says its data is synchronized from the public portal, but it is not itself the official city API or a licence grant.

Status:
- Public portal existence: **VERIFIED**.
- Portal contains traffic camera imagery: **VERIFIED**.
- Exact catalogue endpoint as a supported public API: **NOT VERIFIED**.
- Public website embedding/framing permission for another public app: **NOT VERIFIED**.
- Permission to proxy/cache/republish images or HLS: **NOT VERIFIED**.
- Per-camera HLS availability and HTTPS compatibility: **NOT VERIFIED**.

Sources:
- [Official HCMC traffic portal](https://giaothong.hochiminhcity.gov.vn/Map.aspx)
- [Tuổi Trẻ report on the public traffic-camera portal (19 Jan 2025)](https://tuoitre.vn/nguoi-dan-tp-hcm-co-the-xem-camera-giao-thong-va-hoi-dap-truc-tuyen-20250119152331947.htm)
- [Community camera catalogue README](https://github.com/MeoPaoo/camera-giao-thong-data)
- [Community camera sync implementation](https://github.com/MeoPaoo/camera-giao-thong-data/blob/main/sync_catalog.py)
- [Community third-party notices](https://github.com/MeoPaoo/camera-giao-thong-data/blob/main/THIRD_PARTY_NOTICES.md)

### 2. Community camera catalogue and script

The repository `MeoPaoo/camera-giao-thong-data` describes a catalogue of camera IDs, names, coordinates, image URLs, optional HLS URLs, and an automated sync against the city's public map. Its notices state that camera data and streams belong to the portal operator. The catalogue's MIT notice covers the upstream community WazeVN camera-list script; it does **not** grant rights to the official images or streams and does not prove that the city authorizes redistribution of the updated catalogue.

Status:
- Existence of a community catalogue and sync script: **VERIFIED**.
- Permission to copy its complete synchronized dataset into Mercury Plus: **NOT VERIFIED**.
- Permission to copy/host image and HLS URLs or media: **NOT VERIFIED**.

We will not import this JSON into Mercury Plus or call its undocumented synchronization routine as a production feed until the source owner/operator's terms are established.

### 3. Third-party camera aggregators

- ARGOS ATLAS currently reports hundreds of HCMC still-image cameras and no HCMC continuous video streams; its count changes over time and has differed between crawls. Treat this only as an aggregator's estimate, not an authoritative camera inventory.
- TrafficCam HCM / ePlus.DEV states that it is an independent service, that image/data rights remain with the respective owners, and that display does not grant copying or redistribution rights. Its terms prohibit commercial use and redistribution and describe access as personal-use consultation.

Status:
- Aggregator pages exist: **VERIFIED**.
- Their counts represent the official complete city inventory: **NOT VERIFIED**.
- Permission to reuse their proxy/API or catalogue in Mercury Plus: **NOT GRANTED / NOT VERIFIED**. Do not consume their proxy.

Sources:
- [ARGOS ATLAS — HCMC camera page](https://www.argosatlas.com/en/cameras/vietnam/ho-chi-minh-city/)
- [TrafficCam HCM — source and rights notice](https://camera-hcm.eplus.dev/legal/about)
- [TrafficCam HCM — terms of use](https://camera-hcm.eplus.dev/legal/terms)

## Official contact for permission request

The official website of the **Trung tâm Quản lý điều hành giao thông đô thị** (Urban Traffic Management and Operations Center) describes its role in operating the city's traffic monitoring and control systems and publishes these public contact details:

- Email: `ttqltt.sgtvt@tphcm.gov.vn`
- Telephone: `+84 8 3914 3560`
- Address: `02 Mai Chí Thọ, Phường Thủ Thiêm, TP. Hồ Chí Minh, Vietnam`
- Official center page: [dieuhanhgiaothong-sxd.hochiminhcity.gov.vn](https://dieuhanhgiaothong-sxd.hochiminhcity.gov.vn/)

This is the best verified initial contact found for routing the request. It is **not yet verified** that this office is the sole rights holder or the authorized issuer of third-party camera-embedding permissions. Ask the Center to identify the data owner/authorized approver if the request belongs to another department.

A ready-to-send bilingual request is in [CAMERA_PERMISSION_REQUEST.md](CAMERA_PERMISSION_REQUEST.md).

## Technical design after permission is secured

1. Obtain written confirmation from the portal/operator that Mercury Plus may display the camera catalogue and embed individual still frames and/or HLS streams in a public, non-commercial third-party website. Ask separately about metadata reuse, framing, refresh intervals, attribution, caching, hotlinking, quotas, and takedown requests.
2. Use an authorised catalogue endpoint or a licensed metadata file. Keep source ID, name, coordinates, media type, source URL, attribution, terms URL, `checkedAt`, and `lastFrameAt` separate.
3. Prefer direct browser requests to the official image host where the operator expressly permits embedding. Do not proxy, transcode, store, or archive media unless the permission explicitly allows it.
4. Load only the selected camera on demand. Do not poll hundreds of images every few seconds. Respect server cache headers and operator limits. Show the last successful frame time and a stale/offline state.
5. Support HLS only where the camera is explicitly marked as a stream, the URL is HTTPS, and the operator permits in-browser playback. Do not silently proxy HTTP streams or weaken browser security.
6. Provide visible operator attribution, an official-source link, a report/takedown path, and a notice that imagery may be delayed or unavailable.
7. Do not implement face recognition, number-plate recognition, person identification, individual tracking, or any automated inference about identifiable people.

Suggested future modules (only after approval):
- `data/cameras/hcmc.catalog.json` — approved source metadata, not media.
- `src/cameras/catalog.js` — schema validation, de-duplication, bounding-box filtering and source attribution.
- `src/cameras/refresh.js` — one-camera, on-demand refresh with strict request limits and stale-state tracking.
- `src/cameras/player.js` — still-image viewer and HLS player; no proxy by default.
- `api/cameras/catalog.js` — optional server endpoint only if the official source supports or authorizes a server-side catalogue feed.

The current repository is a vanilla static Leaflet page, not the Vue/Cesium/Pinia upstream application. These paths are proposed future structure, not existing code.

## Acceptance criteria for an enabled camera layer

- At least 3 approved HCMC cameras from different parts of the city load on the map.
- Every marker has a source ID, location provenance, status, operator attribution, and official link.
- Clicking a marker loads exactly that camera; no bulk polling starts.
- Still frames visibly refresh at the provider-approved cadence and show their source timestamp or an explicit unknown timestamp.
- An HLS camera plays only after explicit user action; no autoplay with sound.
- 404, timeout, offline, stale and permission-denied results are distinct.
- Network inspection confirms no proxying, media storage, or unapproved caching.
- No face/plate/person analytics or individual tracking exists.
- Browser tests pass on desktop and mobile; the public deployment is checked at runtime.

## Required blocker

A written display/framing permission or authoritative open-data licence for the exact HCMC camera media is still missing. Until it is received, **the official portal link is the only enabled camera path**. This is a source-rights gate, not a code defect.
