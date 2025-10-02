
// ====================
// Map Initialization
// ====================
const map = L.map('map').setView([17.6868, 83.2185], 10); // Vizag center

// ====================
// Base Layers (Multiple options)
// ====================
const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '© OpenStreetMap contributors'
}).addTo(map);

const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
attribution: 'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
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
// Working Overlay Layers (Removed problematic Stamen layers)
// ====================

// 1. Hillshade (Topography)
const hillshade = L.tileLayer('https://tiles.wmflabs.org/hillshading/{z}/{x}/{y}.png', {
attribution: 'Hillshading: SRTM3 v2 (NASA)',
opacity: 0.5,
maxZoom: 16
});

// 2. Water Bodies Overlay
const watercolor = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg', {
attribution: '© Stamen Design',
opacity: 0.4,
maxZoom: 16
});

// ====================
// Custom Analysis Overlay (EMPTY - replaced by GeoJSON HVI data)
// ====================
const analysisOverlay = L.layerGroup();
// The custom circles previously defined here are removed as the new GeoJSON markers cover this functionality.

// ====================
// Sample GeoJSON Hotspots (Expanded and updated with HVI concept)
// ====================
const sampleGeoJSON = {
"type": "FeatureCollection",
"features": [
// VIZAG CORE DISTRICTS
// Ward 1 - City Center (High Pop/High Built -> High HVI)
{
"type": "Feature",
"properties": {
"name": "Ward 1 - City Center",
"population": 12000,
"built_ratio": 0.60,
"air_quality": "Poor",
"water_access": "Good",
"healthcare_distance": 0.5,
"green_space": 0.15,
"flood_risk": "Medium",
"heat_island": "High",
"transport_access": "Excellent",
"waste_management": "Good"
},
"geometry": { "type": "Point", "coordinates": [83.2185, 17.6868] }
},
// Ward 2 - Expansion Zone (Medium Pop/Medium Built -> Medium HVI)
{
"type": "Feature",
"properties": {
"name": "Ward 2 - Expansion Zone",
"population": 9000,
"built_ratio": 0.25,
"air_quality": "Moderate",
"water_access": "Good",
"healthcare_distance": 1.2,
"green_space": 0.30,
"flood_risk": "Low",
"heat_island": "Medium",
"transport_access": "Good",
"waste_management": "Fair"
},
"geometry": { "type": "Point", "coordinates": [83.2285, 17.6968] }
},
// Ward 3 - Green Belt (Low Pop/Low Built -> Low HVI)
{
"type": "Feature",
"properties": {
"name": "Ward 3 - Green Belt",
"population": 5000,
"built_ratio": 0.20,
"air_quality": "Good",
"water_access": "Fair",
"healthcare_distance": 2.5,
"green_space": 0.65,
"flood_risk": "Low",
"heat_island": "Low",
"transport_access": "Fair",
"waste_management": "Poor"
},
"geometry": { "type": "Point", "coordinates": [83.2385, 17.7068] }
},
// Ward 4 - Gajuwaka Industrial (Very High Pop/High Built -> Highest HVI)
{
"type": "Feature",
"properties": {
"name": "Ward 4 - Gajuwaka Industrial",
"population": 15000,
"built_ratio": 0.55,
"air_quality": "Very Poor",
"water_access": "Poor",
"healthcare_distance": 1.8,
"green_space": 0.08,
"flood_risk": "High",
"heat_island": "Very High",
"transport_access": "Good",
"waste_management": "Poor"
},
"geometry": { "type": "Point", "coordinates": [83.1800, 17.6400] }
},
// Ward 5 - Rushikonda Tech (Medium Pop/Low Built -> Low HVI)
{
"type": "Feature",
"properties": {
"name": "Ward 5 - Rushikonda Tech",
"population": 6500,
"built_ratio": 0.15,
"air_quality": "Good",
"water_access": "Excellent",
"healthcare_distance": 3.2,
"green_space": 0.45,
"flood_risk": "Very Low",
"heat_island": "Low",
"transport_access": "Fair",
"waste_management": "Good"
},
"geometry": { "type": "Point", "coordinates": [83.3500, 17.7600] }
},
// Ward 6 - Anakapalle Outskirts (High Pop/Medium Built -> High HVI)
{
"type": "Feature",
"properties": {
"name": "Ward 6 - Anakapalle Outskirts",
"population": 11000,
"built_ratio": 0.38,
"air_quality": "Moderate",
"water_access": "Fair",
"healthcare_distance": 4.1,
"green_space": 0.25,
"flood_risk": "Medium",
"heat_island": "Medium",
"transport_access": "Poor",
"waste_management": "Fair"
},
"geometry": { "type": "Point", "coordinates": [82.9900, 17.6800] }
},
// Ward 7 - Bheemili Coast (Low Pop/Very Low Built -> Lowest HVI)
{
"type": "Feature",
"properties": {
"name": "Ward 7 - Bheemili Coast",
"population": 4500,
"built_ratio": 0.10,
"air_quality": "Excellent",
"water_access": "Good",
"healthcare_distance": 8.5,
"green_space": 0.70,
"flood_risk": "High",
"heat_island": "Very Low",
"transport_access": "Very Poor",
"waste_management": "Poor"
},
"geometry": { "type": "Point", "coordinates": [83.4300, 17.8500] }
},
// EXPANDED REGIONS - GREATER VIZAG METROPOLITAN AREA
// Ward 8 - Pendurthi Agricultural
{
"type": "Feature",
"properties": {
"name": "Ward 8 - Pendurthi Agricultural",
"population": 7200,
"built_ratio": 0.12,
"air_quality": "Good",
"water_access": "Poor",
"healthcare_distance": 6.8,
"green_space": 0.80,
"flood_risk": "Medium",
"heat_island": "Low",
"transport_access": "Poor",
"waste_management": "Very Poor"
},
"geometry": { "type": "Point", "coordinates": [83.1200, 17.7800] }
},
// Ward 9 - Madhurawada IT Hub
{
"type": "Feature",
"properties": {
"name": "Ward 9 - Madhurawada IT Hub",
"population": 8500,
"built_ratio": 0.35,
"air_quality": "Moderate",
"water_access": "Good",
"healthcare_distance": 2.1,
"green_space": 0.40,
"flood_risk": "Low",
"heat_island": "Medium",
"transport_access": "Excellent",
"waste_management": "Good"
},
"geometry": { "type": "Point", "coordinates": [83.3800, 17.7200] }
},
// Ward 10 - Simhachalam Heritage
{
"type": "Feature",
"properties": {
"name": "Ward 10 - Simhachalam Heritage",
"population": 5800,
"built_ratio": 0.28,
"air_quality": "Good",
"water_access": "Fair",
"healthcare_distance": 3.5,
"green_space": 0.55,
"flood_risk": "Low",
"heat_island": "Low",
"transport_access": "Fair",
"waste_management": "Fair"
},
"geometry": { "type": "Point", "coordinates": [83.2500, 17.7600] }
},
// Ward 11 - Duvvada Industrial Corridor
{
"type": "Feature",
"properties": {
"name": "Ward 11 - Duvvada Industrial Corridor",
"population": 13500,
"built_ratio": 0.48,
"air_quality": "Poor",
"water_access": "Fair",
"healthcare_distance": 2.8,
"green_space": 0.18,
"flood_risk": "High",
"heat_island": "High",
"transport_access": "Good",
"waste_management": "Poor"
},
"geometry": { "type": "Point", "coordinates": [83.1500, 17.6200] }
},
// Ward 12 - Araku Valley Tribal
{
"type": "Feature",
"properties": {
"name": "Ward 12 - Araku Valley Tribal",
"population": 3200,
"built_ratio": 0.05,
"air_quality": "Excellent",
"water_access": "Poor",
"healthcare_distance": 15.2,
"green_space": 0.95,
"flood_risk": "Medium",
"heat_island": "Very Low",
"transport_access": "Very Poor",
"waste_management": "Very Poor"
},
"geometry": { "type": "Point", "coordinates": [82.8700, 18.3300] }
}
]
};

// ====================
// Enhanced Marker Styling (HVI Logic Implemented)
// ====================
function styleMarker(feature) {
const p = feature.properties;

// HVI Calculation: Proxy for Heat Vulnerability
// Score = Population * Built-up Ratio
// (High Population + High Built-up = High Vulnerability)
const HVI = p.population * p.built_ratio;

let color = '#27ae60'; // Default Green (Balanced)
let size = 9;
let risk = 'Low';
let message = '';

// HVI Threshold Logic
if (HVI > 4000) {
// CRITICAL (Example: Ward 1: 7,200 | Ward 4: 8,250 | Ward 6: 4,180)
color = '#e74c3c'; // Red
size = 16;
risk = 'Critical';
message = '⚠️ <b>CRITICAL VULNERABILITY</b><br><br>High density + minimal green space.<br><br>→ Immediate green infrastructure investment needed to mitigate UHI.';
} else if (HVI > 1500) {
// HIGH RISK / GROWTH AREA (Example: Ward 2: 2,250)
color = '#f39c12'; // Orange
size = 12;
risk = 'High';
message = '⚡ <b>HIGH RISK / GROWTH AREA</b><br><br>Medium to high risk of heat island effect.<br><br>→ Proactive planning for green space and cooling measures.';
} else {
// BALANCED / LOW RISK (Example: Ward 3: 1,000 | Ward 5: 975 | Ward 7: 450)
color = '#27ae60'; // Green
size = 9;
risk = 'Low';
message = '✅ <b>BALANCED / LOW RISK</b><br><br>Favorable population-space ratio.<br><br>→ Maintain current balance and monitor future growth.';
}

return {
radius: size,
color: '#fff',
weight: 2,
fillColor: color,
fillOpacity: 0.9,
popup: `<div style="font-family:Arial; min-width:280px; max-width:350px;">
<h3 style="margin:0 0 10px 0; color:${color};">${p.name}</h3>
<table style="width:100%; font-size:11px; border-collapse:collapse;">
<tr><td style="padding:2px;"><b>Population:</b></td><td style="padding:2px;">${p.population.toLocaleString()}</td></tr>
<tr><td style="padding:2px;"><b>Built-up Ratio:</b></td><td style="padding:2px;">${(p.built_ratio * 100).toFixed(0)}%</td></tr>
<tr><td style="padding:2px;"><b>HVI Score:</b></td><td style="padding:2px; color:${color};"><b>${HVI.toLocaleString()}</b></td></tr>
<tr><td style="padding:2px;"><b>Air Quality:</b></td><td style="padding:2px;">${p.air_quality}</td></tr>
<tr><td style="padding:2px;"><b>Water Access:</b></td><td style="padding:2px;">${p.water_access}</td></tr>
<tr><td style="padding:2px;"><b>Healthcare:</b></td><td style="padding:2px;">${p.healthcare_distance}km away</td></tr>
<tr><td style="padding:2px;"><b>Green Space:</b></td><td style="padding:2px;">${(p.green_space * 100).toFixed(0)}%</td></tr>
<tr><td style="padding:2px;"><b>Flood Risk:</b></td><td style="padding:2px;">${p.flood_risk}</td></tr>
<tr><td style="padding:2px;"><b>Heat Island:</b></td><td style="padding:2px;">${p.heat_island}</td></tr>
<tr><td style="padding:2px;"><b>Transport:</b></td><td style="padding:2px;">${p.transport_access}</td></tr>
<tr><td style="padding:2px;"><b>Waste Mgmt:</b></td><td style="padding:2px;">${p.waste_management}</td></tr>
</table>
<hr style="margin:10px 0;">
<p style="margin:5px 0; font-size:11px;">${message}</p>
</div>`
};
}

// ====================
// Add GeoJSON with Custom HVI Markers
// ====================
L.geoJSON(sampleGeoJSON, {
pointToLayer: function (feature, latlng) {
const opts = styleMarker(feature);
return L.circleMarker(latlng, opts).bindPopup(opts.popup);
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
"📊 HVI Priority Zones": analysisOverlay, // Kept to show GeoJSON marker layer, even though empty
"⛰️ Hillshade": hillshade,
"💧 Watercolor": watercolor
},
{ collapsed: false }
).addTo(map);

// ====================
// Info Control Panel (Updated for HVI)
// ====================
const info = L.control({position: 'bottomright'});

info.onAdd = function (map) {
const div = L.DomUtil.create('div', 'info-panel');
div.innerHTML = `
<h4 style="margin:0 0 10px 0; color:#333;">🌡️ Heat Vulnerability Index (HVI)</h4>
<div style="font-size:11px; line-height:1.4;">
<b>HVI = Population × Built-up Ratio</b>



  <b>🔴 CRITICAL RISK (HVI > 4000)</b><br>
  • Requires immediate investment to mitigate UHI effect.<br><br>
  
  <b>🟠 HIGH RISK / GROWTH (HVI > 1500)</b><br>
  • Requires proactive planning for future development.<br><br>
  
  <b>🟢 BALANCED / LOW RISK (HVI ≤ 1500)</b><br>
  • Stable area; focus on maintenance.<br>
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

console.log('✅ Map loaded successfully with HVI prioritization!');
