// ====================
// Map Initialization
// ====================
const map = L.map('map').setView([17.6868, 83.2185], 10); // Vizag center

// ====================
// Base Layers (Multiple options)
// ====================
const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
  maxZoom: 19
});

const cartoDB = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap &copy; CartoDB',
  subdomains: 'abcd',
  maxZoom: 20
});

const topoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data: &copy; OpenStreetMap, SRTM | Map style: &copy; OpenTopoMap',
  maxZoom: 17
});

// ====================
// Copernicus Local Layers
// ====================
const ghsBuilt = L.tileLayer('./tiles_built/{z}/{x}/{y}.png', {
  attribution: '© GHS-BUILT / Copernicus',
  maxZoom: 18,
  opacity: 0.7
}).addTo(map);

const ghsPop = L.tileLayer('./pop/{z}/{x}/{y}.png', {
  attribution: '© GHS-POP / Copernicus',
  maxZoom: 18,
  opacity: 0.7
});

// ====================
// Working Overlay Layers
// ====================

// 1. Stamen Toner (High contrast overlay)
const stamenToner = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_lines/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; Stamen Design &copy; OpenStreetMap',
  opacity: 0.5,
  maxZoom: 20
});

// 2. Stamen Terrain Lines
const terrainLines = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_terrain_lines/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; Stamen Design &copy; OpenStreetMap',
  opacity: 0.6,
  maxZoom: 18
});

// 3. Hillshade (Topography)
const hillshade = L.tileLayer('https://tiles.wmflabs.org/hillshading/{z}/{x}/{y}.png', {
  attribution: 'Hillshading: SRTM3 v2 (NASA)',
  opacity: 0.5,
  maxZoom: 16
});

// 4. Water Bodies Overlay
const watercolor = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg', {
  attribution: '&copy; Stamen Design',
  opacity: 0.4,
  maxZoom: 16
});

// ====================
// Heat Map Demo Layer (Simulated high-density areas)
// ====================
const heatmapPoints = [
  [17.6868, 83.2185, 0.8], // Vizag center - high
  [17.7068, 83.2385, 0.9], // High density
  [17.6968, 83.2285, 0.6], // Medium
  [17.7168, 83.2485, 0.7], // Medium-high
  [17.6768, 83.2085, 0.5], // Medium
  [17.7268, 83.2585, 0.4], // Low-medium
  [17.6668, 83.1985, 0.3]  // Low
];

// Create custom overlay with canvas
const heatmapCanvas = L.tileLayer.canvas({
  attribution: 'Density Heatmap (Demo)',
  opacity: 0.6
});

heatmapCanvas.drawTile = function(canvas, tilePoint, zoom) {
  const ctx = canvas.getContext('2d');
  const size = this.options.tileSize;
  
  // Simple gradient overlay for demo
  const gradient = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size);
  gradient.addColorStop(0, 'rgba(255,0,0,0.3)');
  gradient.addColorStop(1, 'rgba(255,255,0,0.0)');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
};

// ====================
// Custom Analysis Overlay (Visual overlay showing zones)
// ====================
const analysisOverlay = L.layerGroup();

// Add colored circles for different zone types
const highDensityZone = L.circle([17.6868, 83.2185], {
  color: 'red',
  fillColor: '#f03',
  fillOpacity: 0.3,
  radius: 2000
}).bindPopup('<b>High Density Zone</b><br>Population: 12,000+<br>Status: Needs green space');

const growthZone = L.circle([17.6968, 83.2285], {
  color: 'orange',
  fillColor: '#ff9800',
  fillOpacity: 0.3,
  radius: 1500
}).bindPopup('<b>Growth Zone</b><br>Population: 9,000<br>Status: Plan infrastructure');

const balancedZone = L.circle([17.7068, 83.2385], {
  color: 'green',
  fillColor: '#4caf50',
  fillOpacity: 0.3,
  radius: 1200
}).bindPopup('<b>Balanced Zone</b><br>Population: 5,000<br>Status: Good balance');

analysisOverlay.addLayer(highDensityZone);
analysisOverlay.addLayer(growthZone);
analysisOverlay.addLayer(balancedZone);

// ====================
// Layer Control
// ====================
L.control.layers(
  { 
    "OpenStreetMap": osm,
    "Satellite": satellite,
    "Dark Mode": cartoDB,
    "Topographic": topoMap
  }, 
  { 
    "🏗️ GHS-BUILT (Local)": ghsBuilt, 
    "👥 GHS-POP (Local)": ghsPop,
    "📊 Zone Analysis": analysisOverlay,
    "🗺️ Terrain Lines": terrainLines,
    "⛰️ Hillshade": hillshade,
    "🎨 Toner Lines": stamenToner,
    "💧 Watercolor": watercolor
  },
  { collapsed: false }
).addTo(map);

// ====================
// Info Control Panel
// ====================
const info = L.control({position: 'bottomright'});

info.onAdd = function (map) {
  const div = L.DomUtil.create('div', 'info-panel');
  div.innerHTML = `
    <h4 style="margin:0 0 10px 0; color:#333;">📊 Layer Guide</h4>
    <div style="font-size:11px; line-height:1.4;">
      <b>Base Maps:</b><br>
      • Switch between Street, Satellite, Dark, Topo<br><br>
      
      <b>Overlays:</b><br>
      • <span style="color:red">●</span> Zone Analysis - Click circles for info<br>
      • Terrain/Hillshade - Physical features<br>
      • Toner/Watercolor - Artistic styles<br><br>
      
      <b>Your Local Data:</b><br>
      • GHS-BUILT - Building density<br>
      • GHS-POP - Population data<br>
    </div>
  `;
  div.style.padding = '15px';
  div.style.background = 'rgba(255,255,255,0.95)';
  div.style.borderRadius = '8px';
  div.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
  div.style.maxWidth = '250px';
  div.style.fontSize = '12px';
  return div;
};

info.addTo(map);

// ====================
// Sample GeoJSON Hotspots with Enhanced Markers
// ====================
const sampleGeoJSON = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": { 
        "name": "Ward 1 - City Center", 
        "population": 12000, 
        "built_ratio": 0.6,
        "risk": "high"
      },
      "geometry": { "type": "Point", "coordinates": [83.2185, 17.6868] }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "Ward 2 - Expansion Zone", 
        "population": 9000, 
        "built_ratio": 0.25,
        "risk": "medium"
      },
      "geometry": { "type": "Point", "coordinates": [83.2285, 17.6968] }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "Ward 3 - Green Belt", 
        "population": 5000, 
        "built_ratio": 0.2,
        "risk": "low"
      },
      "geometry": { "type": "Point", "coordinates": [83.2385, 17.7068] }
    }
  ]
};

// ====================
// Enhanced Marker Styling
// ====================
function styleMarker(feature) {
  const p = feature.properties;
  let color = 'green';
  let size = 10;
  let message = '';

  if (p.population > 10000 && p.built_ratio > 0.5) {
    color = '#e74c3c';
    size = 15;
    message = '⚠️ <b>HIGH PRIORITY</b><br>High density + minimal open space<br>→ Prioritize green infrastructure';
  } else if (p.population > 8000 && p.built_ratio < 0.3) {
    color = '#f39c12';
    size = 12;
    message = '⚡ <b>GROWTH AREA</b><br>Rapid expansion expected<br>→ Plan infrastructure early';
  } else {
    color = '#27ae60';
    size = 10;
    message = '✅ <b>BALANCED</b><br>Good population-space ratio<br>→ Maintain current balance';
  }

  return {
    radius: size,
    color: '#fff',
    weight: 2,
    fillColor: color,
    fillOpacity: 0.9,
    popup: `
      <div style="font-family:Arial; min-width:200px;">
        <h3 style="margin:0 0 10px 0; color:${color};">${p.name}</h3>
        <table style="width:100%; font-size:12px;">
          <tr><td><b>Population:</b></td><td>${p.population.toLocaleString()}</td></tr>
          <tr><td><b>Built-up Ratio:</b></td><td>${(p.built_ratio * 100).toFixed(0)}%</td></tr>
          <tr><td><b>Risk Level:</b></td><td style="color:${color};"><b>${p.risk.toUpperCase()}</b></td></tr>
        </table>
        <hr style="margin:10px 0;">
        <p style="margin:5px 0; font-size:11px;">${message}</p>
      </div>
    `
  };
}

// ====================
// Add GeoJSON with Custom Markers
// ====================
L.geoJSON(sampleGeoJSON, {
  pointToLayer: function (feature, latlng) {
    const opts = styleMarker(feature);
    return L.circleMarker(latlng, opts).bindPopup(opts.popup);
  }
}).addTo(map);

// ====================
// Add Scale and Coordinates Display
// ====================
L.control.scale({imperial: false, metric: true}).addTo(map);

// Show coordinates on click
map.on('click', function(e) {
  const coord = e.latlng;
  const lat = coord.lat.toFixed(5);
  const lng = coord.lng.toFixed(5);
  
  L.popup()
    .setLatLng(e.latlng)
    .setContent(`📍 <b>Coordinates:</b><br>Lat: ${lat}<br>Lng: ${lng}`)
    .openOn(map);
});

console.log('✅ Map loaded successfully with working layers!');