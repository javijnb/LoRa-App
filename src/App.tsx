import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import './App.css';

function App() {
  return (
    <MapContainer center={[42.1698, -8.6879]} zoom={16} scrollWheelZoom={true}>
      <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
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