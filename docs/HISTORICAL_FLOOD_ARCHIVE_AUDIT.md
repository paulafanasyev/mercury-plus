# Historical HCMC flood archive audit — Mercury Plus

**Checked:** 2026-11-23  
**Dataset:** Hardy, Sebastien; Radziute, Gintaré (2026), *Historical database of urban flooding in Ho Chi Minh City, Vietnam (2002–2026)*  
**DOI:** https://doi.org/10.23708/8Y16HU

## Source and contents

The public DataSuds/IRD dataset describes 425 geolocated urban flood observations recorded between 2002 and 2026 from 53 sources, mainly Vietnamese newspapers and technical reports. Each observation includes event date, location name/type, administrative unit, water-height range/depth class, cause (rain, high tide or combined), impact type, source reference, spatial precision and geocoding method.

Files include:
- `Flood_event_locations.tab` — 425 rows and 22 attributes; attribute table.
- `HCMC_Floods_BDD.gpkg` — `Flood_event_locations` point geometry, 425 points, EPSG:9210.
- `HCMC_Roads.gpkg` — 9 3D lines for flood recurrence by street, EPSG:9210.
- `HCMC_water.gpkg` — 2,430 water/river/canal polygons, EPSG:4326.
- `HCMC_new_limits.gpkg` — administrative boundary reference layers.
- `Metadata-form-HCMC-floods.pdf` — data dictionary for the 22 main attributes.

The tabular attribute file does not supply the point geometry by itself. A map layer must use the GeoPackage geometry and must transform the Vietnamese projected coordinate system (EPSG:9210) to WGS84 (EPSG:4326) before displaying on Leaflet. Do not guess event coordinates by geocoding location names.

## Licence and attribution

The dataset is licensed CC BY-NC 4.0:
- non-commercial use only;
- credit the authors and source dataset;
- include the DOI and licence link;
- indicate any coordinate transformation, simplification or other modification;
- do not imply the events are official current flood alerts.

Suggested attribution:

`Hardy, S. & Radziute, G. (2026). Historical database of urban flooding in Ho Chi Minh City, Vietnam (2002–2026), DataSuds/IRD, v1. https://doi.org/10.23708/8Y16HU. CC BY-NC 4.0.`

Licence: https://creativecommons.org/licenses/by-nc/4.0/

Because the licence is non-commercial, this dataset must be removed or relicensed if Mercury Plus becomes commercial or gains advertising/sponsorship that makes this use inconsistent with the licence.

## Suitability and limitations

**Suitable as:** a historical archive layer, filterable by year, cause, recorded water-height class and source confidence.

**Not suitable as:** live flood detection, current flood status, a warning/forecast, proof that a street is flooding now, or a complete inventory of all flood events.

The dataset authors warn that coverage depends on availability and reliability of reporting sources; under-reported events are likely. Some older ward/district labels pre-date the 1 July 2025 administrative reform. Use the `Current_admin_unit` field and retain original location names for traceability.

## Integration status

- Dataset exists and file access is public: **VERIFIED**.
- 425 geolocated observations and CC BY-NC 4.0 terms: **VERIFIED**.
- GeoPackage spatial layer available: **VERIFIED**.
- Coordinate conversion pipeline into Leaflet GeoJSON: **NOT IMPLEMENTED**.
- Historical flood layer in Mercury Plus map: **NOT IMPLEMENTED**.
- Live HCMC flood sensor/API feed: **NOT VERIFIED**.

Before implementation:
1. Download the exact v1.0 files directly from the dataset page.
2. Verify MD5 checksums shown by DataSuds.
3. Extract point geometry from the GeoPackage; transform EPSG:9210 to EPSG:4326.
4. Validate the 425 point count, attribute join key and bounds against the published dataset metadata.
5. Generate a compact GeoJSON preserving event date, height class, cause, source, spatial precision and current administrative unit.
6. Add source/CC BY-NC attribution and an explicit archive-only warning in the map.
7. Add tests for geometry count, coordinate bounds, duplicate IDs, missing dates and licence attribution.

## References

- [Dataset DOI — DataSuds/IRD](https://doi.org/10.23708/8Y16HU)
- [Dataset description, contents and licence](https://dataverse.ird.fr/dataset.xhtml?persistentId=doi:10.23708/8Y16HU)
- [GeoPackage point layer](https://dataverse.ird.fr/file.xhtml?fileId=50143&version=1.0)
- [Tabular attributes](https://dataverse.ird.fr/file.xhtml?fileId=50148&version=1.0)
- [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/)
