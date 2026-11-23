# Panoramax community-photo coverage in Ho Chi Minh City

**Checked:** 2026-11-23  
**Scope:** Mercury Plus public non-commercial browser pilot, Ho Chi Minh City only.

## Decision

- Panoramax API and HCMC public sample: **VERIFIED**.
- Metadata-only map markers and source-viewer links: implemented in this change.
- Image embedding, proxying, thumbnailing, caching or re-hosting in Mercury Plus: **NOT ENABLED**.
- City-wide continuous Street View: **NOT AVAILABLE / NOT PROVEN**.
- KartaView coverage in HCMC: **NOT VERIFIED**.

The layer is community-submitted photography. It is not CCTV, live video or a continuous street panorama.

## Live catalogue sample

Endpoint:
`https://api.panoramax.xyz/api/search?bbox=106.60,10.65,106.90,10.98&limit=100`

Live response on 2026-11-23:
- The raw search endpoint returned HTTP 200 and 100 records. After filtering to public (`visibility=anyone`), ready, point geometry and CC BY-SA 4.0, the Mercury Plus production adapter accepted **98 photos** and grouped them into **28 marker locations**.
- All 98 accepted items declare **CC BY-SA 4.0**.
- The filtered production response attributes all 98 accepted items to `naoNao89` (100% of the eligible sample); this concentration makes the coverage especially unrepresentative.
- The earlier raw response contained two additional author records, but they were excluded by the stricter public/ready/licence filter.
- Capture dates in the current filtered production response range from 2026-01-15 to 2026-03-28.
- This is sparse, concentrated and contributor-biased coverage, not a representative city-wide Street View network.

Sample item:
- ID: `6145ddce-f59e-4c59-af36-4c8ec80cccf1`
- Coordinates: `106.72228739, 10.82858541`
- Capture time: `2026-03-28T14:42:43.654485+00:00`
- Author: `naoNao89`
- Visibility: `anyone`; status: `ready`
- Licence: `CC BY-SA 4.0`
- [Open original photo in Panoramax](https://api.panoramax.xyz/?focus=pic&pic=6145ddce-f59e-4c59-af36-4c8ec80cccf1) — viewer URL tested HTTP 200.

## Photo content limitations

Spot checks show mixed content: some images clearly depict roads and vehicles; others depict buildings, parks or unrelated indoor scenes. Public visibility does not mean every item is a road-traffic photograph. The Mercury Plus label therefore says “community photos”, not “traffic cameras”.

## Privacy and media handling

Panoramax supports blurring, but its documentation describes blur processing as optional and dependent on a server-side service configuration (for example `API_BLUR_URL`). The public instance configuration does not reveal whether that service is enabled.

Mercury Plus consequently returns metadata and official viewer links only. It does not download, embed, proxy, cache, thumbnail or re-host image bytes. Any future embedded-image mode must first verify the precise instance's blur configuration and privacy terms, and preserve per-image CC BY-SA attribution and ShareAlike obligations.

## Technical adapter

- Fixed upstream: `https://api.panoramax.xyz/api/search`.
- Fixed bbox: `106.60,10.65,106.90,10.98`; fixed cap 100.
- Only public, ready, point-geometry items with CC BY-SA 4.0 are accepted.
- Points are grouped by four-decimal coordinate buckets.
- Popup shows every item in the coordinate group, with author, capture time, per-item licence and the exact original viewer link. Popups are scrollable for dense clusters.
- Shared cache: 30 minutes with stale-while-revalidate.
- User-triggered request only; no background polling.
- No image assets are sent to the client.

## Acceptance checks

- Production endpoint returns HTTP 200 and no image asset URLs.
- Map shows one marker per coordinate group.
- Popup links to each original image and shows attribution/capture time.
- The panel states that the photos are neither CCTV nor live.
- No image bytes are fetched by Mercury Plus.
- No face recognition, plate recognition, personal identification or individual tracking.

## References

- [Panoramax catalogue search](https://api.panoramax.xyz/api/search?bbox=106.60,10.65,106.90,10.98&limit=100)
- [Panoramax official site/viewer](https://panoramax.fr/)
- [Sample item viewer](https://api.panoramax.xyz/?focus=pic&pic=6145ddce-f59e-4c59-af36-4c8ec80cccf1)
- [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
- [Panoramax documentation](https://docs.panoramax.fr/)
