# Open-Meteo weather source audit — Mercury Plus

**Checked:** 2026-11-23  
**Scope:** public non-commercial browser pilot for Ho Chi Minh City.

## Decision

**Provider endpoint: VERIFIED.**  
**One current-weather API response for HCMC: VERIFIED (HTTP 200).**  
**Browser UI integration: implemented in this commit; production browser interaction still pending runtime verification.**  
**Commercial use of the free endpoint: NOT ALLOWED.**

## Endpoint and test

- API documentation: https://open-meteo.com/en/docs
- Terms: https://open-meteo.com/en/terms
- Data licence: https://open-meteo.com/en/licence
- Endpoint: `https://api.open-meteo.com/v1/forecast`
- Variables requested: temperature, relative humidity, apparent temperature, day/night, precipitation, rain, showers, weather code, wind speed/direction and gusts.
- Timezone: `Asia/Ho_Chi_Minh`.
- API key: not required.

A live API request for the Mercury Plus map centre returned HTTP 200. At model time `2026-11-23 12:45` (Vietnam time) the sample response reported 33.5°C, apparent temperature 37.9°C, relative humidity 47%, precipitation 0 mm, wind 5.7 km/h, gusts 21.2 km/h and WMO weather code 3 (overcast). Open-Meteo resolved its forecast grid cell at approximately `10.7909, 106.7109`, not the exact requested map coordinate. Values are therefore grid-based model estimates, not measurements from a street-level station.

Current conditions in the API are based on weather-model output with a 15-minute interval. Underlying model publication cadence depends on the selected model and can be slower; never call this a live observation or emergency warning.

## Usage and licence conditions

The current Open-Meteo Free API terms specify:
- strictly non-commercial use;
- fewer than 10,000 API calls/day, 5,000/hour and 600/minute;
- data under CC BY 4.0;
- visible attribution with a link to Open-Meteo and the licence;
- the provider may block misuse and does not guarantee uninterrupted availability or accuracy.

Mercury Plus is currently a public non-commercial pilot with no subscriptions or advertising. The interface requests data only after the visitor presses the weather button, has a one-minute local refresh guard, and does not persist or proxy weather responses. This reduces unnecessary requests but is not a global quota limiter across browsers or devices. Reassess the provider plan before adding background polling, expanding traffic substantially, or making the project commercial.

## Implemented UI behaviour

- User clicks **ЗАГРУЗИТЬ ПОГОДУ**; there is no automatic page-load request.
- Displays model timestamp, temperature, apparent temperature, humidity, precipitation for the 15-minute interval, wind speed/direction and gusts.
- Displays the returned model grid cell coordinates.
- Shows provider attribution and links to CC BY 4.0.
- Displays a stale/unavailable status on failure.
- No weather radar, lightning overlay, flood forecast or severe-weather warning is implemented by this change.

## References

- [Open-Meteo API documentation](https://open-meteo.com/en/docs)
- [Open-Meteo Terms & Privacy](https://open-meteo.com/en/terms)
- [Open-Meteo CC BY 4.0 data licence](https://open-meteo.com/en/licence)
