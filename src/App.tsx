import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import './App.css';

function App() {
  return (
    <MapContainer center={[42.1698, -8.6879]} zoom={6} scrollWheelZoom={true}>
      <TileLayer
        attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        url="'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'"
      />
      <Marker position={[42.1698, -8.6879]}>
        <Popup>
          Escuela Teleco <br /> Sensor 1
        </Popup>
      </Marker>
    </MapContainer>
  );
}

export default App;