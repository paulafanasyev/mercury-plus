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

  const dialog = document.getElementById('aboutDialog');
  document.getElementById('aboutButton').addEventListener('click', () => dialog.showModal());
  document.getElementById('closeAbout').addEventListener('click', () => dialog.close());
  window.addEventListener('resize', () => map.invalidateSize());
})();