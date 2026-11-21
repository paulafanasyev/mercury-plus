(() => {
  const center = [10.7769, 106.7009];
  const map = L.map('map', { zoomControl: false, scrollWheelZoom: true }).setView(center, 12);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom: 2,
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a>'
  }).addTo(map);

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
    message.textContent = 'Place search is not connected in this pilot yet. No external geocoding requests are sent.';
  });

  const dialog = document.getElementById('aboutDialog');
  document.getElementById('aboutButton').addEventListener('click', () => dialog.showModal());
  document.getElementById('closeAbout').addEventListener('click', () => dialog.close());
  window.addEventListener('resize', () => map.invalidateSize());
})();