# Production routing verification — Mercury Plus

**Date:** 2026-11-23  
**Scope:** public non-commercial browser pilot, Ho Chi Minh City only  
**Production:** https://mercury-plus.vercel.app/  
**Repository commit:** `81b628ac59536cc04eda2c8ce2b79d25f8f74116`  
**Vercel deployment:** `dpl_4QG17oNFZEoP2bWxiCiJEULgFuSQ` — `READY`

## Results

| Check | Result | Evidence |
|---|---|---|
| Vercel production build | **PASS** | Deployment is READY at the commit listed above |
| Public page response | **PASS** | HTTP 200 |
| Route UI present in production HTML | **PASS** | `routeButton` and `routePanel` are present |
| Public Cameras section remains present | **PASS** | `PUBLIC CAMERAS` and official portal URL found in production HTML |
| Production route API | **PASS** | `GET /api/route?start=106.7009,10.7769&end=106.6955,10.7829` returned HTTP 200 and `code: Ok` |
| Returned route data | **PASS** | 1,312.6 m; 129.5 s estimated; 7 manoeuvre steps; road names include Lê Thánh Tôn, Pasteur, Nguyễn Thị Minh Khai and Phạm Ngọc Thạch |
| Malformed coordinates | **PASS** | `GET /api/route?start=abc&end=1,2` returned HTTP 400 with a validation error |
| Manual map clicks A then B on a physical browser/device | **NOT PROVEN** | The HTML and API were checked separately; no real user click-through/browser automation was performed |

## Technical boundary

The API uses a fixed upstream host (`router.project-osrm.org`); it does not accept an arbitrary URL. It validates coordinate syntax and geographic ranges, applies a timeout, sends an identifying User-Agent and Referer, and returns `Cache-Control: no-store`. Invalid inputs are rejected before an upstream request.

The current in-memory request guard is per client and per warm Vercel function instance. It is **not** a shared global limiter across all serverless instances. It must not be represented as a global provider rate cap. Before a public launch with material traffic, either:
1. move rate control to a shared store/queue with an atomic global limit, or
2. deploy and operate a dedicated OSRM instance for the permitted HCMC region.

The public OSRM demo is best-effort, non-commercial and has no uptime guarantee. It is suitable only for this limited pilot validation. No caching or route history is enabled.

## What this feature does not do

- It does not report current congestion, traffic speeds, road closures or live incidents.
- It does not provide turn-by-turn GPS navigation or location tracking.
- It does not constitute emergency routing or a safety-critical service.
- It does not implement walk/cycle routing in Mercury Plus yet.

## Next acceptance gate

Manually test on desktop and mobile browsers: enable route mode, click A, click B, confirm the line, distance, estimated time and instructions; retry with a no-route pair; reset and close the panel; confirm normal map clicking works after route mode exits. Capture a browser runtime test and then update this file with the device/browser details.
