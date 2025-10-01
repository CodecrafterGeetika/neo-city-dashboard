// ====================
// Initialize Map
// ====================
const map = L.map('map').setView([17.6868, 83.2185], 11); // Vizag center

// Base OSM
const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// ====================
// Tile Layers
// ====================

// Built-up (from your downloaded tiles)
const ghsBuilt = L.tileLayer('./tiles_built/{z}/{x}/{y}.png', {
  attribution: '© GHS-BUILT / Copernicus',
  maxZoom: 18,
  opacity: 0.7
}).addTo(map); // visible by default

// Population density
const ghsPop = L.tileLayer('./tiles_pop/{z}/{x}/{y}.png', {
  attribution: '© GHS-POP / Copernicus',
  maxZoom: 18,
  opacity: 0.7
});

// ====================
// Layer Control
// ====================
L.control.layers(
  { "OpenStreetMap": osm },
  { "GHS-BUILT": ghsBuilt, "GHS-POP": ghsPop }
).addTo(map);

// ====================
// Example GeoJSON Hotspots
// ====================
// Replace with your real data: population + built_ratio
// Example minimal GeoJSON format
const sampleGeoJSON = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": { "name": "Ward 1", "population": 12000, "built_ratio": 0.6 },
      "geometry": { "type": "Point", "coordinates": [83.2185, 17.6868] }
    },
    {
      "type": "Feature",
      "properties": { "name": "Ward 2", "population": 9000, "built_ratio": 0.25 },
      "geometry": { "type": "Point", "coordinates": [83.2285, 17.6968] }
    },
    {
      "type": "Feature",
      "properties": { "name": "Ward 3", "population": 5000, "built_ratio": 0.2 },
      "geometry": { "type": "Point", "coordinates": [83.2385, 17.7068] }
    }
  ]
};

// Function to style markers
function styleMarker(feature) {
  const p = feature.properties;
  let color = 'green';
  let message = '';

  if (p.population > 10000 && p.built_ratio > 0.5) {
    color = 'red';
    message = '⚠ High density, minimal open space → prioritize green space';
  } else if (p.population > 8000 && p.built_ratio < 0.3) {
    color = 'orange';
    message = '⚡ Growing area, plan infrastructure early';
  } else {
    color = 'green';
    message = '✅ Balanced zone';
  }

  return {
    radius: 8,
    color: color,
    fillColor: color,
    fillOpacity: 0.8,
    popup: `<b>${p.name}</b><br>Population: ${p.population}<br>Built-up Ratio: ${p.built_ratio}<br>${message}`
  };
}

// Add markers to map
L.geoJSON(sampleGeoJSON, {
  pointToLayer: function (feature, latlng) {
    const opts = styleMarker(feature);
    return L.circleMarker(latlng, opts).bindPopup(opts.popup);
  }
}).addTo(map);