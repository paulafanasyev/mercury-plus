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
  input.addEventListener('keydown', async (event) => {
    if (event.key !== 'Enter' || !input.value.trim()) return;
    const query = input.value.trim();
    message.textContent = 'Searching OpenStreetMap…';
    try {
      const url = new URL('https://nominatim.openstreetmap.org/search');
      url.searchParams.set('q', query + ', Ho Chi Minh City, Vietnam');
      url.searchParams.set('format', 'jsonv2');
      url.searchParams.set('limit', '1');
      const response = await fetch(url, { headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error('Search unavailable');
      const results = await response.json();
      if (!results.length) {
        message.textContent = 'No result found. Try a Vietnamese or English place name.';
        return;
      }
      const result = results[0];
      const lat = Number(result.lat);
      const lon = Number(result.lon);
      map.flyTo([lat, lon], 16, { duration: 1.1 });
      message.textContent = result.display_name.split(',').slice(0, 3).join(', ');
    } catch {
      message.textContent = 'Search is temporarily unavailable. The map remains usable.';
    }
  });

  const dialog = document.getElementById('aboutDialog');
  document.getElementById('aboutButton').addEventListener('click', () => dialog.showModal());
  document.getElementById('closeAbout').addEventListener('click', () => dialog.close());
  window.addEventListener('resize', () => map.invalidateSize());
})();