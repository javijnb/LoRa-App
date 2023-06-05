import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import BotonSidebar from '../BotonSidebar/BotonSidebar';

const opciones = {color: 'blue'}

const MapComponent = ({ sidebarVisible, setSidebarVisible } : any) => {

const handleToggleSidebar = () => {
  setSidebarVisible(!sidebarVisible);
};

  return (
    <div className="map-container">
      <MapContainer center={[42.277673, -7.952615]} zoom={17} scrollWheelZoom={true}>
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"/>

        <Marker position={[42.278663, -7.953605]}>
          <Popup>Registro más antiguo<br /> Dispositivo - N2</Popup>
        </Marker>

        <Marker position={[42.276600, -7.955392]}>
          <Popup>Registro más reciente <br /> Dispositivo - N2</Popup>
        </Marker>

        <Polyline pathOptions={opciones} positions={[
          [42.278663, -7.953605], 
          [42.277673, -7.952615], 
          [42.278746, -7.951314], 
          [42.276600, -7.955392]]}/>

      </MapContainer>
      <BotonSidebar onToggle={handleToggleSidebar}>Mostrar / Ocultar Sidebar</BotonSidebar>
    </div>
  );
}

export default MapComponent;