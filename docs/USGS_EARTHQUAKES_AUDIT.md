# USGS regional earthquake layer — source audit

**Checked:** 2026-11-23  
**Scope:** public non-commercial HCMC browser pilot.

## Verified source

USGS ComCat FDSN Event Web Service:
- API: https://earthquake.usgs.gov/fdsnws/event/1/query
- Official API docs: https://earthquake.usgs.gov/fdsnws/event/1/
- USGS developer overview: https://earthquake.usgs.gov/data/software/
- Output: GeoJSON (`format=geojson`)
- Authentication: none required for the tested public request.

The USGS documentation recommends its real-time GeoJSON feeds for automated display when suitable; the FDSN Event API is used here because the pilot needs a custom HCMC-centred radius query.

## Exact HCMC query tested

Centre: `10.7769, 106.7009`  
Radius: 1,000 km  
Period: 2025-11-23 through 2026-11-23  
Minimum magnitude: 3.5  
Sort: newest first  
Maximum result count: 200

The API returned HTTP 200 and **10 events**. Reported magnitudes range from 4.1 to 4.5; the events are mainly near Trà My and Kon Tum in central Vietnam. A separate 30-day query found no events within 500 km or 1,000 km of HCMC. This supports a 12-month regional-context layer rather than claiming a live earthquake alert around the city.

The API reports each event's point coordinates, magnitude, depth, provider time, place description, and USGS event-page URL. The application shows those provider fields and opens the source record.

## Implemented behaviour

- The visitor explicitly clicks **ЗАГРУЗИТЬ ЗЕМЛЕТРЯСЕНИЯ**; no background polling runs.
- A same-origin `/api/earthquakes` endpoint uses a fixed USGS host and fixed HCMC centre/radius/window parameters; no arbitrary upstream URL can be supplied.
- The endpoint asks for GeoJSON, applies a 12-month window, a 1,000 km radius, magnitude ≥3.5 and a maximum of 200 records.
- The endpoint response is eligible for a 15-minute shared cache with stale-while-revalidate.
- The client draws magnitude-scaled circle markers. Clicking a marker shows magnitude, place, provider time, depth and the USGS event-page link.
- A separate button zooms the map to the regional events.
- Failure, empty results and loaded/visible states are distinguished.
- The UI labels the layer as a regional catalogue, not an HCMC sensor or warning.

## Attribution and limits

Attribute the feed to the **USGS Earthquake Hazards Program / ComCat** and link to https://earthquake.usgs.gov/. The USGS catalogue is subject to data updates, revisions and contributing-network quality differences. Do not present magnitude or location as a local official government warning. The layer is not a hazard forecast and is not suitable for emergency response.

## Verification boundary

- USGS endpoint and query format: **VERIFIED**.
- Test response HTTP 200 with 10 features: **VERIFIED**.
- Production `/api/earthquakes` endpoint: **VERIFIED**; HTTP 200 and 10 GeoJSON features returned on 2026-11-23.
- Production HTML contains the earthquake load/card/focus controls: **VERIFIED**.
- Manual map-marker click-through, popup rendering and focus-button interaction on a physical browser/device: **NOT PROVEN**.

## References

- [USGS FDSN Event Web Service documentation](https://earthquake.usgs.gov/fdsnws/event/1/)
- [USGS developer resources and earthquake data feeds](https://earthquake.usgs.gov/data/software/)
- [USGS ComCat GeoJSON output](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php)
