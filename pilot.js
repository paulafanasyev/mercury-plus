(() => {
  const center = [10.7769, 106.7009];
  const map = L.map('map', { zoomControl: false, scrollWheelZoom: true }).setView(center, 12);
  const streetLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom: 2,
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a>'
  });
  const satelliteLayer = L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    minZoom: 0,
    maxZoom: 19,
    attribution: 'Sources: Esri, Vantor, Earthstar Geographics, USDA, USGS, and the GIS User Community'
  });
  streetLayer.addTo(map);

  const streetMode = document.getElementById('streetMode');
  const satelliteMode = document.getElementById('satelliteMode');
  const baseMapStatus = document.getElementById('baseMapStatus');
  function setBaseMap(mode) {
    const satellite = mode === 'satellite';
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