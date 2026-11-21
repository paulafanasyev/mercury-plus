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
    return L.tileLayer(
      'https://static-map-tiles-api.arcgis.com/arcgis/rest/services/static-basemap-tiles-service/v1/arcgis/imagery/standard/static/tile/{z}/{y}/{x}?token=' + encodeURIComponent(apiKey),
      {
        minZoom: 0,
        maxZoom: 19,
        attribution: 'Imagery: Esri, Vantor, Earthstar Geographics, and the GIS User Community'
      }
    );
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
  if (satelliteLayer) {
    satelliteLayer.on('tileerror', () => {
      updateSatelliteStatus(false, 'CHECK API KEY');
      baseMapStatus.textContent = 'ESRI TILE ERROR · CHECK KEY / QUOTA';
    });
    satelliteLayer.on('tileload', () => updateSatelliteStatus(true, 'CONNECTED'));
  }

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

  const dialog = document.getElementById('aboutDialog');
  document.getElementById('aboutButton').addEventListener('click', () => dialog.showModal());
  document.getElementById('closeAbout').addEventListener('click', () => dialog.close());
  window.addEventListener('resize', () => map.invalidateSize());
})();