import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import BotonSidebar from '../BotonSidebar/BotonSidebar';
import { LatLngTuple } from 'leaflet';

const opciones = {color: 'blue'}

const MapComponent = ({ sidebarVisible, setSidebarVisible } : any) => {

const handleToggleSidebar = () => {
  setSidebarVisible(!sidebarVisible);
};

const center : LatLngTuple = [42.277673, -7.952615];
const first_position : LatLngTuple = [42.278663, -7.953605];
const last_position : LatLngTuple = [42.276600, -7.955392];
const coord_array : LatLngTuple[] = [
  [42.278663, -7.953605], 
  [42.277673, -7.952615], 
  [42.278746, -7.951314], 
  [42.276600, -7.955392]];

  return (
    <div className="map-container">
      <MapContainer center={center} zoom={18} scrollWheelZoom={true}>
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"/>

        <Marker position={first_position}>
          <Popup>Registro más antiguo<br /> Dispositivo - N2</Popup>
        </Marker>

        <Marker position={last_position}>
          <Popup>Registro más reciente<br /> Dispositivo - N2</Popup>
        </Marker>

        <Polyline pathOptions={opciones} positions={coord_array}/>

      </MapContainer>
      <BotonSidebar onToggle={handleToggleSidebar}></BotonSidebar>
    </div>
  );
}

export default MapComponent;