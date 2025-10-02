// ====================
// Map Initialization
// ====================
const map = L.map('map').setView([17.6868, 83.2185], 10); // Vizag center

// ====================
// Base Layers
// ====================
const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles © Esri',
  maxZoom: 19
});

const cartoDB = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '© OpenStreetMap © CartoDB',
  subdomains: 'abcd',
  maxZoom: 20
});

const topoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data: © OpenStreetMap, SRTM | Map style: © OpenTopoMap',
  maxZoom: 17
});

// ====================
// Local Data Layers
// ====================
const ghsBuilt = L.tileLayer('./tiles_built/{z}/{x}/{y}.png', {
  attribution: '© GHS-BUILT / Copernicus',
  maxZoom: 18,
  opacity: 0.7
});

const ghsPop = L.tileLayer('./pop/{z}/{x}/{y}.png', {
  attribution: '© GHS-POP / Copernicus',
  maxZoom: 18,
  opacity: 0.7
});

// ====================
// Overlay Layers
// ====================
const hillshade = L.tileLayer('https://tiles.wmflabs.org/hillshading/{z}/{x}/{y}.png', {
  attribution: 'Hillshading: SRTM3 v2 (NASA)',
  opacity: 0.5,
  maxZoom: 16
});

const watercolor = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg', {
  attribution: '© Stamen Design',
  opacity: 0.4,
  maxZoom: 16
});

const analysisOverlay = L.layerGroup(); // Reserved for future use
let globalHviLayer = L.layerGroup();

function loadGlobalHviZones() {
  fetch('./global_hvi_zones.geojson')
    .then(response => response.json())
    .then(data => {
      globalHviLayer.clearLayers();
      L.geoJSON(data, {
        style: function(feature) {
          let color = '#e74c3c';
          if (feature.properties && feature.properties.risk) {
            if (feature.properties.risk === 'low') color = '#27ae60';
            else if (feature.properties.risk === 'medium') color = '#2980b9';
            else if (feature.properties.risk === 'high') color = '#f39c12';
            else if (feature.properties.risk === 'critical') color = '#e74c3c';
          }
          return {
            color: color,
            weight: 2,
            fillOpacity: 0.3
          };
        },
        onEachFeature: function(feature, layer) {
          let props = feature.properties || {};
          let html = `<b>Zone:</b> ${props.name || 'N/A'}<br>`;
          if (props.risk) html += `<b>Risk:</b> ${props.risk}<br>`;
          if (props.population) html += `<b>Population:</b> ${props.population}<br>`;
          layer.bindPopup(html);
        }
      }).addTo(globalHviLayer);

      // Fit to global bounds if valid
      try {
        let bounds = globalHviLayer.getBounds();
        if (bounds.isValid()) map.fitBounds(bounds, {maxZoom: 4});
      } catch(e) { /* ignore */ }
    });
}

map.on('overlayadd', function(e) {
  if (e.name && e.name.includes('HVI Priority Zones')) {
    loadGlobalHviZones();
    globalHviLayer.addTo(map);
  }
});
map.on('overlayremove', function(e) {
  if (e.name && e.name.includes('HVI Priority Zones')) {
    map.removeLayer(globalHviLayer);
  }
});

// ====================
// Ward GeoJSON Data (unified, consistent)
// ====================
const wardsGeoJSON = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "Ward 1 - City Center",
        "population": 12000,
        "built_ratio": 0.60,
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
        "built_ratio": 0.20,
        "risk": "low"
      },
      "geometry": { "type": "Point", "coordinates": [83.2385, 17.7068] }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Ward 4 - Gajuwaka Industrial",
        "population": 15000,
        "built_ratio": 0.55,
        "risk": "critical"
      },
      "geometry": { "type": "Point", "coordinates": [83.1800, 17.6400] }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Ward 5 - Rushikonda Tech",
        "population": 6500,
        "built_ratio": 0.15,
        "risk": "low"
      },
      "geometry": { "type": "Point", "coordinates": [83.3500, 17.7600] }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Ward 6 - Anakapalle Outskirts",
        "population": 11000,
        "built_ratio": 0.38,
        "risk": "high"
      },
      "geometry": { "type": "Point", "coordinates": [82.9900, 17.6800] }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Ward 7 - Bheemili Coast",
        "population": 4500,
        "built_ratio": 0.10,
        "risk": "low"
      },
      "geometry": { "type": "Point", "coordinates": [83.4300, 17.8500] }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Ward 8 - Pendurthi Agricultural",
        "population": 7200,
        "built_ratio": 0.12,
        "risk": "medium"
      },
      "geometry": { "type": "Point", "coordinates": [83.1200, 17.7800] }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Ward 9 - Madhurawada IT Hub",
        "population": 8500,
        "built_ratio": 0.35,
        "risk": "medium"
      },
      "geometry": { "type": "Point", "coordinates": [83.3424, 17.7896] }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Ward 10 - Simhachalam Heritage",
        "population": 5800,
        "built_ratio": 0.28,
        "risk": "low"
      },
      "geometry": { "type": "Point", "coordinates": [83.2500, 17.7600] }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Ward 11 - Duvvada Industrial Corridor",
        "population": 13500,
        "built_ratio": 0.48,
        "risk": "high"
      },
      "geometry": { "type": "Point", "coordinates": [83.1500, 17.6200] }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Ward 12 - Araku Valley Tribal",
        "population": 3200,
        "built_ratio": 0.05,
        "risk": "critical"
      },
      "geometry": { "type": "Point", "coordinates": [82.8700, 18.3300] }
    }
  ]
};

// ====================
// Enhanced Marker Styling
// ====================
function styleMarker(feature, highlight = false) {
  const p = feature.properties;
  let color = '#27ae60'; // Green
  let size = 10;
  let border = '#fff';

  // Risk coloring
  if (p.risk === 'critical') {
    color = '#e74c3c';
    size = 16;
  } else if (p.risk === 'high') {
    color = '#f39c12';
    size = 13;
  } else if (p.risk === 'medium') {
    color = '#2980b9';
    size = 11;
  }
  if (highlight) {
    border = '#222';
    size += 5;
  }

  return {
    radius: size,
    color: border,
    weight: 3,
    fillColor: color,
    fillOpacity: highlight ? 1 : 0.9,
    className: highlight ? 'ward-highlight' : '',
    riseOnHover: true
  };
}

// ====================
// Add GeoJSON with Custom Markers and Store References
// ====================
let wardMarkers = []; // [{name, marker, feature}]
const geoJsonLayer = L.geoJSON(wardsGeoJSON, {
  pointToLayer: function (feature, latlng) {
    const marker = L.circleMarker(latlng, styleMarker(feature));
    marker.bindPopup(
      `<div style="font-family:Arial; min-width:220px;">
        <h3 style="margin:0 0 10px 0; color:${styleMarker(feature).fillColor};">${feature.properties.name}</h3>
        <table style="width:100%; font-size:11px;">
          <tr><td><b>Population:</b></td><td>${feature.properties.population.toLocaleString()}</td></tr>
          <tr><td><b>Built-up Ratio:</b></td><td>${(feature.properties.built_ratio * 100).toFixed(0)}%</td></tr>
          <tr><td><b>Risk:</b></td><td>${feature.properties.risk.charAt(0).toUpperCase() + feature.properties.risk.slice(1)}</td></tr>
        </table>
      </div>`
    );
    wardMarkers.push({ name: feature.properties.name, marker, feature });
    return marker;
  }
}).addTo(map);

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
    "📊 HVI Priority Zones": globalHviLayer,
    
    "⛰️ Hillshade": hillshade,
    "💧 Watercolor": watercolor
  },
  { collapsed: false }
).addTo(map);

// ====================
// Ward Highlight Logic
// ====================

// Reset all markers to normal appearance
function resetWards() {
  wardMarkers.forEach(({ marker, feature }) => {
    marker.setStyle(styleMarker(feature, false));
    marker.closePopup();
  });
}

// Highlight wards by name (array of names)
function highlightWards(wardNames) {
  resetWards();
  wardMarkers.forEach(({ name, marker, feature }) => {
    if (wardNames.includes(name)) {
      marker.setStyle(styleMarker(feature, true));
      marker.openPopup();
      // Optionally, pan to marker
      // map.panTo(marker.getLatLng());
    }
  });
}

// ====================
// Analysis/Planning Tool Functions
// ====================
const analysisConfig = {
  healthcare: {
    wards: [
      "Ward 12 - Araku Valley Tribal",
      "Ward 6 - Anakapalle Outskirts"
    ]
  },
  transport: {
    wards: [
      "Ward 7 - Bheemili Coast",
      "Ward 8 - Pendurthi Agricultural"
    ]
  },
  green: {
    wards: [
      "Ward 4 - Gajuwaka Industrial",
      "Ward 1 - City Center"
    ]
  },
  flood: {
    wards: [
      "Ward 7 - Bheemili Coast",
      "Ward 11 - Duvvada Industrial Corridor"
    ]
  },
  growth: {
    wards: [
      "Ward 2 - Expansion Zone",
      "Ward 9 - Madhurawada IT Hub"
    ]
  }
};

function showAnalysis(type) {
  const wards = analysisConfig[type] && analysisConfig[type].wards;
  if (wards) {
    highlightWards(wards);
  } else {
    resetWards();
  }
}

// Make showAnalysis globally accessible for HTML buttons
window.showAnalysis = showAnalysis;

// ====================
// Info Panel, Scale, and Map Click
// ====================
const info = L.control({ position: 'bottomright' });

info.onAdd = function (map) {
  const div = L.DomUtil.create('div', 'info-panel');
  div.innerHTML = `
    <h4 style="margin:0 0 10px 0; color:#333;">🌡️ Heat Vulnerability Index (HVI)</h4>
    <div style="font-size:11px; line-height:1.4;">
    <b>Ward risk level is based on population and built-up ratio.</b><br><br>
    <b>🔴 Critical</b>: Immediate intervention<br>
    <b>🟠 High</b>: Proactive planning<br>
    <b>🔵 Medium</b>: Monitor growth<br>
    <b>🟢 Low</b>: Stable area<br>
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

L.control.scale({ imperial: false, metric: true }).addTo(map);

map.on('click', function (e) {
  const lat = e.latlng.lat.toFixed(5);
  const lng = e.latlng.lng.toFixed(5);
  L.popup()
    .setLatLng(e.latlng)
    .setContent(`📍 <b>Coordinates:</b><br>Lat: ${lat}<br>Lng: ${lng}`)
    .openOn(map);
});

console.log('✅ Map loaded successfully. Planning Tools now highlight wards interactively!');
