(() => {
  const center = [10.7769, 106.7009];
  const map = L.map('map', { zoomControl: false, scrollWheelZoom: true }).setView(center, 12);
  const streetLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom: 2,
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a>'
  });
  let satelliteLayer = null;
  const API_KEY_STORAGE = 'mercury-plus.arcgis-api-key';
  const satelliteStatus = document.getElementById('satelliteLayerStatus');
  const providerDialog = document.getElementById('providerDialog');
  const providerKeyInput = document.getElementById('providerApiKey');
  const providerKeyMessage = document.getElementById('providerKeyMessage');
  let savedApiKey = '';
  try { savedApiKey = localStorage.getItem(API_KEY_STORAGE) || ''; } catch (_) {}

  function createSatelliteLayer(apiKey) {
    const layer = L.tileLayer(
      'https://static-map-tiles-api.arcgis.com/arcgis/rest/services/static-basemap-tiles-service/v1/arcgis/imagery/standard/static/tile/{z}/{y}/{x}?token=' + encodeURIComponent(apiKey),
      {
        minZoom: 0,
        maxZoom: 19,
        attribution: 'Imagery: Esri, Vantor, Earthstar Geographics, and the GIS User Community'
      }
    );
    layer.on('tileerror', () => {
      updateSatelliteStatus(false, 'CHECK API KEY');
      baseMapStatus.textContent = 'ESRI TILE ERROR · CHECK KEY / QUOTA';
    });
    layer.on('tileload', () => updateSatelliteStatus(true, 'CONNECTED'));
    return layer;
  }

  function updateSatelliteStatus(ready, label) {
    satelliteStatus.textContent = label || (ready ? 'KEY SAVED' : 'KEY REQUIRED');
    satelliteStatus.classList.toggle('status-live', ready);
    satelliteStatus.classList.toggle('status-pending', !ready);
  }

  if (savedApiKey) {
    satelliteLayer = createSatelliteLayer(savedApiKey);
    updateSatelliteStatus(true, 'KEY SAVED');
  } else {
    updateSatelliteStatus(false, 'KEY REQUIRED');
  }

  streetLayer.addTo(map);

  const streetMode = document.getElementById('streetMode');
  const satelliteMode = document.getElementById('satelliteMode');
  const baseMapStatus = document.getElementById('baseMapStatus');
  function setBaseMap(mode) {
    const satellite = mode === 'satellite';
    if (satellite && !satelliteLayer) {
      providerKeyMessage.textContent = 'Для спутникового режима сначала добавьте свой ArcGIS API key.';
      providerKeyInput.value = '';
      providerDialog.showModal();
      return;
    }
    if (satellite) {
      if (map.hasLayer(streetLayer)) map.removeLayer(streetLayer);
      satelliteLayer.addTo(map);
    } else {
      if (map.hasLayer(satelliteLayer)) map.removeLayer(satelliteLayer);
      streetLayer.addTo(map);
    }
    streetMode.classList.toggle('is-active', !satellite);
    satelliteMode.classList.toggle('is-active', satellite);
    streetMode.setAttribute('aria-pressed', String(!satellite));
    satelliteMode.setAttribute('aria-pressed', String(satellite));
    baseMapStatus.textContent = satellite ? 'SATELLITE IMAGERY · ESRI' : 'STREET MAP · OPENSTREETMAP';
  }
  streetMode.addEventListener('click', () => setBaseMap('street'));
  satelliteMode.addEventListener('click', () => setBaseMap('satellite'));

  document.getElementById('providerSettingsButton').addEventListener('click', () => {
    providerKeyInput.value = '';
    providerKeyMessage.textContent = savedApiKey ? 'На этом устройстве уже сохранён API key. Вставьте новый для замены или удалите текущий.' : 'Ключ ещё не добавлен.';
    providerDialog.showModal();
  });
  document.getElementById('closeProviderDialog').addEventListener('click', () => providerDialog.close());
  document.getElementById('saveProviderKey').addEventListener('click', () => {
    const key = providerKeyInput.value.trim();
    if (!key) {
      providerKeyMessage.textContent = 'Вставьте API key перед сохранением.';
      return;
    }
    try {
      localStorage.setItem(API_KEY_STORAGE, key);
      savedApiKey = key;
      if (satelliteLayer && map.hasLayer(satelliteLayer)) map.removeLayer(satelliteLayer);
      satelliteLayer = createSatelliteLayer(savedApiKey);
      updateSatelliteStatus(true, 'KEY SAVED');
      providerKeyInput.value = '';
      providerKeyMessage.textContent = 'Ключ сохранён локально. Включаю спутниковый слой.';
      providerDialog.close();
      setBaseMap('satellite');
    } catch (_) {
      providerKeyMessage.textContent = 'Не удалось сохранить ключ в этом браузере. Проверьте настройки хранения.';
    }
  });
  document.getElementById('clearProviderKey').addEventListener('click', () => {
    try { localStorage.removeItem(API_KEY_STORAGE); } catch (_) {}
    savedApiKey = '';
    if (satelliteLayer && map.hasLayer(satelliteLayer)) map.removeLayer(satelliteLayer);
    satelliteLayer = null;
    updateSatelliteStatus(false, 'KEY REQUIRED');
    setBaseMap('street');
    providerKeyInput.value = '';
    providerKeyMessage.textContent = 'Ключ удалён с этого устройства.';
  });
  const marker = L.circleMarker(center, {
    radius: 6, color: '#b8fff0', weight: 2, fillColor: '#42c7b7', fillOpacity: 1
  }).addTo(map);
  marker.bindTooltip('Ho Chi Minh City · pilot center');

  document.getElementById('homeButton').addEventListener('click', () => map.setView(center, 12));
  document.getElementById('zoomIn').addEventListener('click', () => map.zoomIn());
  document.getElementById('zoomOut').addEventListener('click', () => map.zoomOut());

  const input = document.getElementById('placeSearch');
  const message = document.getElementById('searchMessage');
  input.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' || !input.value.trim()) return;
    message.textContent = 'Place search is not connected yet. No external geocoding requests are sent.';
  });

  // User-triggered HCMC driving routes. One route request is sent only after two map clicks.
  const routeButton = document.getElementById('routeButton');
  const routePanel = document.getElementById('routePanel');
  const routeStatus = document.getElementById('routeStatus');
  const routeStartText = document.getElementById('routeStartText');
  const routeEndText = document.getElementById('routeEndText');
  const routeSummary = document.getElementById('routeSummary');
  const routeSteps = document.getElementById('routeSteps');
  const routeMarkers = [];
  let routeLine = null;
  let routePoints = [];
  let routeModeEnabled = false;
  let lastRouteRequestAt = 0;

  function formatRouteDistance(metres) {
    return metres >= 1000 ? (metres / 1000).toFixed(1) + ' км' : Math.round(metres) + ' м';
  }
  function formatRouteDuration(seconds) {
    const minutes = Math.max(1, Math.round(seconds / 60));
    if (minutes < 60) return minutes + ' мин';
    return Math.floor(minutes / 60) + ' ч ' + (minutes % 60) + ' мин';
  }
  function routeInstruction(step) {
    const maneuver = step.maneuver || {};
    const labels = {
      depart: 'Начать движение', turn: 'Повернуть', 'new name': 'Продолжить движение',
      continue: 'Продолжить движение', merge: 'Влиться в поток', 'on ramp': 'Въехать на съезд',
      'off ramp': 'Съехать с дороги', fork: 'На развилке держаться',
      'end of road': 'На конце дороги повернуть', roundabout: 'На круговом движении',
      rotary: 'На круговом движении', 'exit rotary': 'Съехать с кругового движения',
      notification: 'Продолжить движение', arrive: 'Прибытие'
    };
    const modifiers = {
      left: 'налево', right: 'направо', straight: 'прямо',
      'slight left': 'плавно налево', 'slight right': 'плавно направо',
      'sharp left': 'резко налево', 'sharp right': 'резко направо', uturn: 'разворот'
    };
    let action = labels[maneuver.type] || 'Продолжить движение';
    const modifier = modifiers[maneuver.modifier];
    if (modifier && maneuver.type !== 'depart' && maneuver.type !== 'arrive') action += ' ' + modifier;
    const road = step.rotaryName || step.name;
    return road ? action + ' — ' + road : action;
  }
  function clearRouteLayers() {
    routeMarkers.forEach(markerItem => map.removeLayer(markerItem));
    routeMarkers.length = 0;
    if (routeLine) {
      map.removeLayer(routeLine);
      routeLine = null;
    }
  }
  function resetRoute(clearText = true) {
    clearRouteLayers();
    routePoints = [];
    routeModeEnabled = false;
    routeButton.classList.remove('is-active');
    if (clearText) {
      routeStartText.textContent = 'Начальная точка не выбрана';
      routeEndText.textContent = 'Конечная точка не выбрана';
      routeSummary.hidden = true;
      routeSummary.textContent = '';
      routeSteps.replaceChildren();
      routeStatus.textContent = 'Нажмите на «МАРШРУТ», затем выберите две точки на карте.';
    }
  }
  function enableRouteSelection() {
    resetRoute();
    routePanel.hidden = false;
    routeModeEnabled = true;
    routeButton.classList.add('is-active');
    routeStatus.textContent = 'Выберите на карте начальную точку A.';
  }
  routeButton.addEventListener('click', () => {
    if (routeModeEnabled) {
      routeModeEnabled = false;
      routeButton.classList.remove('is-active');
      routeStatus.textContent = routePoints.length === 1
        ? 'Выбор остановлен. Нажмите «МАРШРУТ», чтобы выбрать точки заново.'
        : 'Выбор точек остановлен.';
      return;
    }
    enableRouteSelection();
  });
  document.getElementById('closeRoutePanel').addEventListener('click', () => {
    routeModeEnabled = false;
    routeButton.classList.remove('is-active');
    routePanel.hidden = true;
  });
  document.getElementById('clearRoute').addEventListener('click', enableRouteSelection);

  async function requestDrivingRoute(start, end) {
    if (Date.now() - lastRouteRequestAt < 1000) {
      throw new Error('Подождите секунду перед следующим запросом маршрута.');
    }
    lastRouteRequestAt = Date.now();
    const query = new URLSearchParams({
      start: start.lng + ',' + start.lat,
      end: end.lng + ',' + end.lat
    });
    const response = await fetch('/api/route?' + query.toString(), {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'no-store'
    });
    let data;
    try { data = await response.json(); }
    catch (_) { throw new Error('Сервис маршрутов вернул некорректный ответ.'); }
    if (!response.ok) throw new Error(data.error || 'Не удалось получить маршрут (HTTP ' + response.status + ').');
    if (data.code !== 'Ok' || !data.route || !data.route.geometry) {
      throw new Error(data.error || 'Для этих точек маршрут не найден.');
    }
    return data.route;
  }

  map.on('click', async (event) => {
    if (!routeModeEnabled) return;
    const point = { lat: event.latlng.lat, lng: event.latlng.lng };
    routePoints.push(point);
    const markerItem = L.circleMarker([point.lat, point.lng], {
      radius: 8, color: '#071722', weight: 2,
      fillColor: routePoints.length === 1 ? '#68d8b9' : '#e9b76c',
      fillOpacity: 1
    }).addTo(map);
    markerItem.bindTooltip(routePoints.length === 1 ? 'A · Начало маршрута' : 'B · Конец маршрута');
    routeMarkers.push(markerItem);
    if (routePoints.length === 1) {
      routeStartText.textContent = point.lat.toFixed(5) + ', ' + point.lng.toFixed(5);
      routeStatus.textContent = 'Точка A выбрана. Теперь нажмите на карте, чтобы указать конечную точку B.';
      return;
    }
    routeEndText.textContent = point.lat.toFixed(5) + ', ' + point.lng.toFixed(5);
    routeModeEnabled = false;
    routeButton.classList.remove('is-active');
    routeStatus.textContent = 'Строю маршрут по дорожной сети…';
    try {
      const route = await requestDrivingRoute(routePoints[0], routePoints[1]);
      routeLine = L.geoJSON(route.geometry, {
        style: { color: '#62d9c6', weight: 5, opacity: 0.9 }
      }).addTo(map);
      const bounds = routeLine.getBounds();
      if (bounds.isValid()) map.fitBounds(bounds, { padding: [44, 44], maxZoom: 16 });
      routeSummary.hidden = false;
      routeSummary.textContent = formatRouteDistance(route.distanceMeters) + ' · ' +
        formatRouteDuration(route.durationSeconds) + ' · ' + (route.summary || 'Маршрут A—B');
      routeSteps.replaceChildren();
      route.steps.forEach(step => {
        const item = document.createElement('li');
        item.appendChild(document.createTextNode(routeInstruction(step)));
        const detail = document.createElement('span');
        detail.textContent = formatRouteDistance(step.distanceMeters);
        item.appendChild(detail);
        routeSteps.appendChild(item);
      });
      routeStatus.textContent = 'Маршрут рассчитан. Для нового маршрута нажмите «СБРОСИТЬ И ВЫБРАТЬ СНОВА».';
    } catch (error) {
      routeStatus.textContent = error && error.message ? error.message : 'Ошибка сервиса маршрутов.';
    }
  });

  // On-demand HCMC model weather. No key, no polling, no stored responses.
  const weatherLayerStatus = document.getElementById('weatherLayerStatus');
  const loadWeatherButton = document.getElementById('loadWeatherButton');
  const refreshWeatherButton = document.getElementById('refreshWeatherButton');
  const weatherCard = document.getElementById('weatherCard');
  const weatherMessage = document.getElementById('weatherMessage');
  const weatherUrl = 'https://api.open-meteo.com/v1/forecast?latitude=10.7769&longitude=106.7009' +
    '&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m' +
    '&timezone=Asia%2FHo_Chi_Minh';
  let weatherRequest = null;
  let lastWeatherRequestAt = 0;
  let weatherHasData = false;

  function weatherCodeLabel(code, isDay) {
    const labels = {
      0: isDay ? 'Ясно' : 'Ясная ночь',
      1: 'Преимущественно ясно',
      2: 'Переменная облачность',
      3: 'Пасмурно',
      45: 'Туман',
      48: 'Туман / изморозь',
      51: 'Слабая морось',
      53: 'Морось',
      55: 'Сильная морось',
      56: 'Переохлаждённая морось',
      57: 'Сильная переохлаждённая морось',
      61: 'Небольшой дождь',
      63: 'Дождь',
      65: 'Сильный дождь',
      66: 'Ледяной дождь',
      67: 'Сильный ледяной дождь',
      71: 'Небольшой снег',
      73: 'Снег',
      75: 'Сильный снег',
      77: 'Снежная крупа',
      80: 'Небольшой ливень',
      81: 'Ливень',
      82: 'Сильный ливень',
      85: 'Снежный заряд',
      86: 'Сильный снежный заряд',
      95: 'Гроза',
      96: 'Гроза с градом',
      99: 'Сильная гроза с градом'
    };
    return labels[code] || 'Код погоды: ' + code;
  }

  function weatherNumber(value, digits = 1) {
    const number = Number(value);
    return Number.isFinite(number) ? number.toFixed(digits) : '—';
  }

  function weatherDirection(degrees) {
    const points = ['С', 'СВ', 'В', 'ЮВ', 'Ю', 'ЮЗ', 'З', 'СЗ'];
    const number = Number(degrees);
    if (!Number.isFinite(number)) return '—';
    return points[Math.round(number / 45) % 8];
  }

  async function loadHcmcWeather() {
    if (weatherRequest) return weatherRequest;
    const now = Date.now();
    if (lastWeatherRequestAt && now - lastWeatherRequestAt < 60000) {
      weatherMessage.textContent = 'Обновление доступно не чаще одного раза в минуту.';
      weatherCard.hidden = false;
      return;
    }
    lastWeatherRequestAt = now;
    weatherLayerStatus.textContent = 'LOADING';
    weatherLayerStatus.classList.remove('status-live', 'status-off');
    weatherLayerStatus.classList.add('status-pending');
    weatherMessage.textContent = 'Запрашиваю модельные данные…';
    loadWeatherButton.disabled = true;
    refreshWeatherButton.disabled = true;
    loadWeatherButton.textContent = 'ЗАГРУЗКА…';

    weatherRequest = (async () => {
      try {
        const response = await fetch(weatherUrl, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          cache: 'no-store',
          signal: AbortSignal.timeout(12000)
        });
        if (!response.ok) throw new Error('Погодный сервис ответил HTTP ' + response.status + '.');
        const payload = await response.json();
        const current = payload && payload.current;
        if (!current || !Number.isFinite(Number(current.temperature_2m)) ||
            !Number.isFinite(Number(current.weather_code))) {
          throw new Error('В ответе нет корректных текущих модельных условий.');
        }

        document.getElementById('weatherTemperature').textContent = weatherNumber(current.temperature_2m) + '°C';
        document.getElementById('weatherDescription').textContent =
          weatherCodeLabel(Number(current.weather_code), Number(current.is_day) === 1);
        document.getElementById('weatherModelTime').textContent =
          'Время модели: ' + String(current.time || 'не указано').replace('T', ' ') + ' · Вьетнам';
        document.getElementById('weatherFeelsLike').textContent = weatherNumber(current.apparent_temperature) + '°C';
        document.getElementById('weatherHumidity').textContent = weatherNumber(current.relative_humidity_2m, 0) + '%';
        document.getElementById('weatherPrecipitation').textContent = weatherNumber(current.precipitation, 1) + ' мм';
        document.getElementById('weatherWind').textContent = weatherNumber(current.wind_speed_10m) + ' км/ч';
        document.getElementById('weatherGusts').textContent = weatherNumber(current.wind_gusts_10m) + ' км/ч';
        document.getElementById('weatherWindDirection').textContent =
          weatherDirection(current.wind_direction_10m) + ' · ' + weatherNumber(current.wind_direction_10m, 0) + '°';
        const gridPoint = 'Модельная ячейка: ' + weatherNumber(payload.latitude, 4) + '°, ' +
          weatherNumber(payload.longitude, 4) + '° · шаг ' + weatherNumber(current.interval / 60, 0) + ' мин';
        document.getElementById('weatherGridPoint').textContent = gridPoint;

        weatherHasData = true;
        weatherCard.hidden = false;
        weatherMessage.textContent = '';
        weatherLayerStatus.textContent = 'MODEL DATA';
        weatherLayerStatus.classList.remove('status-pending', 'status-off');
        weatherLayerStatus.classList.add('status-live');
        loadWeatherButton.textContent = 'ОБНОВИТЬ ПОГОДУ';
      } catch (error) {
        weatherLayerStatus.textContent = weatherHasData ? 'STALE' : 'UNAVAILABLE';
        weatherLayerStatus.classList.remove('status-live', 'status-pending');
        weatherLayerStatus.classList.add('status-off');
        weatherMessage.textContent = error && error.message
          ? error.message
          : 'Не удалось получить погоду. Повторите позже.';
        weatherCard.hidden = false;
      } finally {
        loadWeatherButton.disabled = false;
        refreshWeatherButton.disabled = false;
        loadWeatherButton.textContent = weatherHasData ? 'ОБНОВИТЬ ПОГОДУ' : 'ПОВТОРИТЬ ЗАПРОС';
        weatherRequest = null;
      }
    })();
    return weatherRequest;
  }

  loadWeatherButton.addEventListener('click', loadHcmcWeather);
  refreshWeatherButton.addEventListener('click', loadHcmcWeather);

  // On-demand regional earthquake catalogue from USGS ComCat.
  const earthquakeLayerStatus = document.getElementById('earthquakeLayerStatus');
  const loadEarthquakesButton = document.getElementById('loadEarthquakesButton');
  const earthquakeCard = document.getElementById('earthquakeCard');
  const earthquakeSummary = document.getElementById('earthquakeSummary');
  const earthquakeUpdated = document.getElementById('earthquakeUpdated');
  const earthquakeMessage = document.getElementById('earthquakeMessage');
  const focusEarthquakesButton = document.getElementById('focusEarthquakesButton');
  const earthquakeLayer = L.featureGroup();
  let earthquakeLoaded = false;
  let earthquakeVisible = false;
  let earthquakeRequest = null;

  function earthquakeDate(timestamp) {
    const number = Number(timestamp);
    if (!Number.isFinite(number)) return 'Время не указано';
    return new Date(number).toLocaleString('ru-RU', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Ho_Chi_Minh'
    }) + ' · Вьетнам';
  }

  function earthquakePopup(feature) {
    const props = feature.properties || {};
    const coords = feature.geometry.coordinates || [];
    const depth = Number(coords[2]);
    const popup = document.createElement('div');
    popup.className = 'earthquake-popup';
    const heading = document.createElement('strong');
    heading.textContent = 'M ' + Number(props.mag).toFixed(1);
    popup.appendChild(heading);

    const place = document.createElement('p');
    place.textContent = String(props.place || 'Место события не указано');
    popup.appendChild(place);

    const details = document.createElement('small');
    details.textContent = earthquakeDate(props.time) + ' · глубина ' +
      (Number.isFinite(depth) ? depth.toFixed(1) + ' км' : 'не указана');
    popup.appendChild(details);

    if (typeof props.url === 'string' && props.url.startsWith('https://earthquake.usgs.gov/')) {
      const link = document.createElement('a');
      link.href = props.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = 'ОТКРЫТЬ КАРТОЧКУ USGS ↗';
      popup.appendChild(link);
    }
    return popup;
  }

  function renderEarthquakes(features) {
    earthquakeLayer.clearLayers();
    features.forEach(feature => {
      const coordinates = feature.geometry && feature.geometry.coordinates;
      if (!Array.isArray(coordinates) || coordinates.length < 2) return;
      const longitude = Number(coordinates[0]);
      const latitude = Number(coordinates[1]);
      const magnitude = Number(feature.properties && feature.properties.mag);
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude) ||
          latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180 ||
          !Number.isFinite(magnitude)) return;
      const radius = Math.max(5, Math.min(13, 3 + magnitude * 1.8));
      const marker = L.circleMarker([latitude, longitude], {
        radius,
        color: '#122936',
        weight: 1.5,
        fillColor: magnitude >= 5 ? '#e98c6b' : '#e7bd68',
        fillOpacity: 0.88
      });
      marker.bindPopup(earthquakePopup(feature));
      earthquakeLayer.addLayer(marker);
    });
  }

  async function loadEarthquakes() {
    if (earthquakeRequest) return earthquakeRequest;
    if (earthquakeLoaded) {
      if (earthquakeVisible) {
        map.removeLayer(earthquakeLayer);
        earthquakeVisible = false;
        loadEarthquakesButton.textContent = 'ПОКАЗАТЬ МЕТКИ';
        earthquakeLayerStatus.textContent = 'LOADED';
      } else {
        earthquakeLayer.addTo(map);
        earthquakeVisible = true;
        loadEarthquakesButton.textContent = 'СКРЫТЬ МЕТКИ';
        earthquakeLayerStatus.textContent = 'VISIBLE';
      }
      return;
    }

    loadEarthquakesButton.disabled = true;
    loadEarthquakesButton.textContent = 'ЗАГРУЖАЮ…';
    earthquakeLayerStatus.textContent = 'LOADING';
    earthquakeLayerStatus.classList.remove('status-live', 'status-off');
    earthquakeLayerStatus.classList.add('status-pending');
    earthquakeMessage.textContent = 'Запрашиваю региональный каталог USGS…';
    earthquakeCard.hidden = false;

    earthquakeRequest = (async () => {
      try {
        const response = await fetch('/api/earthquakes', {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          cache: 'no-store',
          signal: AbortSignal.timeout(15000)
        });
        let payload;
        try { payload = await response.json(); }
        catch (_) { throw new Error('USGS вернул некорректный ответ.'); }
        if (!response.ok) throw new Error(payload.error || 'Каталог землетрясений недоступен (HTTP ' + response.status + ').');
        const features = Array.isArray(payload.features) ? payload.features : [];
        renderEarthquakes(features);
        earthquakeLoaded = true;
        if (earthquakeLayer.getLayers().length) {
          earthquakeLayer.addTo(map);
          earthquakeVisible = true;
          loadEarthquakesButton.textContent = 'СКРЫТЬ МЕТКИ';
          earthquakeLayerStatus.textContent = earthquakeLayer.getLayers().length + ' EVENTS';
          earthquakeLayerStatus.classList.remove('status-pending', 'status-off');
          earthquakeLayerStatus.classList.add('status-live');
          focusEarthquakesButton.hidden = false;
          earthquakeMessage.textContent = 'Метки загружены. Нажмите на точку для магнитуды, глубины, времени и ссылки на источник.';
        } else {
          earthquakeLayerStatus.textContent = 'NO EVENTS';
          earthquakeLayerStatus.classList.remove('status-pending');
          earthquakeLayerStatus.classList.add('status-live');
          loadEarthquakesButton.textContent = 'ПРОВЕРИТЬ СНОВА';
          earthquakeMessage.textContent = 'В выбранном радиусе и временном диапазоне событий не найдено.';
        }
        earthquakeSummary.textContent = features.length + ' событий · магнитуда ≥ 3,5';
        earthquakeUpdated.textContent = 'Каталог USGS обновлён: ' + earthquakeDate(payload.metadata && payload.metadata.generated);
      } catch (error) {
        earthquakeLayerStatus.textContent = 'UNAVAILABLE';
        earthquakeLayerStatus.classList.remove('status-live', 'status-pending');
        earthquakeLayerStatus.classList.add('status-off');
        earthquakeMessage.textContent = error && error.message
          ? error.message
          : 'Не удалось загрузить каталог USGS. Повторите запрос позже.';
        loadEarthquakesButton.textContent = 'ПОВТОРИТЬ ЗАПРОС';
      } finally {
        loadEarthquakesButton.disabled = false;
        earthquakeRequest = null;
      }
    })();
    return earthquakeRequest;
  }

  loadEarthquakesButton.addEventListener('click', loadEarthquakes);
  focusEarthquakesButton.addEventListener('click', () => {
    const bounds = earthquakeLayer.getBounds();
    if (bounds && bounds.isValid()) map.fitBounds(bounds, { padding: [36, 36], maxZoom: 7 });
  });

  // Sparse Panoramax community-photo locations. Photos remain on their original instances.
  const panoramaxLayerStatus = document.getElementById('panoramaxLayerStatus');
  const loadPanoramaxButton = document.getElementById('loadPanoramaxButton');
  const panoramaxCard = document.getElementById('panoramaxCard');
  const panoramaxSummary = document.getElementById('panoramaxSummary');
  const panoramaxUpdated = document.getElementById('panoramaxUpdated');
  const panoramaxMessage = document.getElementById('panoramaxMessage');
  const focusPanoramaxButton = document.getElementById('focusPanoramaxButton');
  const panoramaxLayer = L.featureGroup();
  let panoramaxLoaded = false;
  let panoramaxVisible = false;
  let panoramaxRequest = null;

  function panoramaxCaptureTime(value) {
    if (!value) return 'Дата съёмки не указана';
    const date = new Date(value);
    if (!Number.isFinite(date.getTime())) return 'Дата съёмки не указана';
    return date.toLocaleString('ru-RU', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Ho_Chi_Minh'
    }) + ' · Вьетнам';
  }

  function createPanoramaxPopup(location) {
    const root = document.createElement('div');
    root.className = 'panoramax-popup';
    const title = document.createElement('strong');
    title.textContent = location.count + ' фото в этой точке';
    root.appendChild(title);
    const note = document.createElement('p');
    note.textContent = 'Фото общественного пространства · не видеопоток';
    root.appendChild(note);
    (location.items || []).forEach(item => {
      const row = document.createElement('div');
      row.className = 'panoramax-popup-item';
      const meta = document.createElement('small');
      meta.textContent = panoramaxCaptureTime(item.capturedAt) + ' · ' +
        (item.author || 'Автор не указан') + ' · CC BY-SA 4.0';
      row.appendChild(meta);
      const link = document.createElement('a');
      link.href = item.viewerUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = 'ОТКРЫТЬ ОРИГИНАЛ В PANORAMAX ↗';
      row.appendChild(link);
      root.appendChild(row);
    });
    const coordinates = document.createElement('small');
    coordinates.className = 'panoramax-popup-coords';
    coordinates.textContent = Number(location.lat).toFixed(5) + ', ' + Number(location.lon).toFixed(5);
    root.appendChild(coordinates);
    return root;
  }

  function renderPanoramaxLocations(locations) {
    panoramaxLayer.clearLayers();
    (locations || []).forEach(location => {
      const lat = Number(location.lat), lon = Number(location.lon), count = Number(location.count);
      if (!Number.isFinite(lat) || !Number.isFinite(lon) || lat < -90 || lat > 90 ||
          lon < -180 || lon > 180 || !Number.isFinite(count) || count < 1) return;
      const marker = L.circleMarker([lat, lon], {
        radius: Math.min(10, 5 + Math.log2(count + 1)),
        color: '#163c4b', weight: 1.5, fillColor: '#7fc6c2', fillOpacity: 0.88
      });
      marker.bindPopup(createPanoramaxPopup(location), { maxWidth: 270, maxHeight: 300 });
      panoramaxLayer.addLayer(marker);
    });
  }

  async function loadPanoramaxLocations() {
    if (panoramaxRequest) return panoramaxRequest;
    if (panoramaxLoaded) {
      if (panoramaxVisible) {
        map.removeLayer(panoramaxLayer); panoramaxVisible = false;
        loadPanoramaxButton.textContent = 'ПОКАЗАТЬ ФОТОТОЧКИ';
        panoramaxLayerStatus.textContent = 'LOADED';
      } else {
        panoramaxLayer.addTo(map); panoramaxVisible = true;
        loadPanoramaxButton.textContent = 'СКРЫТЬ ФОТОТОЧКИ';
        panoramaxLayerStatus.textContent = 'VISIBLE';
      }
      return;
    }

    loadPanoramaxButton.disabled = true;
    loadPanoramaxButton.textContent = 'ЗАГРУЖАЮ…';
    panoramaxLayerStatus.textContent = 'LOADING';
    panoramaxLayerStatus.classList.remove('status-live', 'status-off');
    panoramaxLayerStatus.classList.add('status-pending');
    panoramaxMessage.textContent = 'Запрашиваю каталог публичных фотографий Panoramax…';
    panoramaxCard.hidden = false;

    panoramaxRequest = (async () => {
      try {
        const response = await fetch('/api/panoramax-photos', {
          method: 'GET', headers: { 'Accept': 'application/json' },
          cache: 'no-store', signal: AbortSignal.timeout(15000)
        });
        let payload;
        try { payload = await response.json(); }
        catch (_) { throw new Error('Panoramax вернул некорректный ответ.'); }
        if (!response.ok) throw new Error(payload.error || 'Каталог фотографий недоступен (HTTP ' + response.status + ').');
        if (!Array.isArray(payload.locations)) throw new Error('В ответе нет списка фототочек.');
        renderPanoramaxLocations(payload.locations);
        panoramaxLoaded = true;
        if (panoramaxLayer.getLayers().length) {
          panoramaxLayer.addTo(map); panoramaxVisible = true;
          loadPanoramaxButton.textContent = 'СКРЫТЬ ФОТОТОЧКИ';
          panoramaxLayerStatus.textContent = panoramaxLayer.getLayers().length + ' LOCATIONS';
          panoramaxLayerStatus.classList.remove('status-pending', 'status-off');
          panoramaxLayerStatus.classList.add('status-live');
          focusPanoramaxButton.hidden = false;
          panoramaxMessage.textContent = 'Нажмите на точку, чтобы увидеть дату и автора и открыть оригинал у Panoramax.';
        } else {
          panoramaxLayerStatus.textContent = 'NO PHOTOS';
          panoramaxLayerStatus.classList.remove('status-pending');
          panoramaxLayerStatus.classList.add('status-live');
          loadPanoramaxButton.textContent = 'ПОВТОРИТЬ ЗАПРОС';
          panoramaxMessage.textContent = 'В выбранной области фотографии не найдены.';
        }
        const metadata = payload.metadata || {};
        panoramaxSummary.textContent = (metadata.photoCount || 0) + ' фото · ' +
          (metadata.locationCount || panoramaxLayer.getLayers().length) + ' координатных точек';
        panoramaxUpdated.textContent = 'Каталог проверен: ' +
          (metadata.checkedAt ? panoramaxCaptureTime(metadata.checkedAt) : 'время не указано');
      } catch (error) {
        panoramaxLayerStatus.textContent = 'UNAVAILABLE';
        panoramaxLayerStatus.classList.remove('status-live', 'status-pending');
        panoramaxLayerStatus.classList.add('status-off');
        panoramaxMessage.textContent = error && error.message ? error.message : 'Не удалось загрузить фотокаталог. Повторите запрос позже.';
        loadPanoramaxButton.textContent = 'ПОВТОРИТЬ ЗАПРОС';
      } finally {
        loadPanoramaxButton.disabled = false;
        panoramaxRequest = null;
      }
    })();
    return panoramaxRequest;
  }

  loadPanoramaxButton.addEventListener('click', loadPanoramaxLocations);
  focusPanoramaxButton.addEventListener('click', () => {
    const bounds = panoramaxLayer.getBounds();
    if (bounds && bounds.isValid()) map.fitBounds(bounds, { padding: [36, 36], maxZoom: 14 });
  });

  const dialog = document.getElementById('aboutDialog');
  document.getElementById('aboutButton').addEventListener('click', () => dialog.showModal());
  document.getElementById('closeAbout').addEventListener('click', () => dialog.close());
  window.addEventListener('resize', () => map.invalidateSize());
})();