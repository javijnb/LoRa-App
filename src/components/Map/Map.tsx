import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import BotonSidebar from '../BotonSidebar/BotonSidebar';
import { LatLngTuple } from 'leaflet';
import { InfluxDB } from '@influxdata/influxdb-client';
import { useEffect } from 'react';

const opciones = {color: 'blue'}

const MapComponent = ({ sidebarVisible, setSidebarVisible } : any) => {

  const client = new InfluxDB({
    url: 'http://192.168.230.100:8087',
    token: 'rw8VxXW_lp5ieFtPpzD482FNT_VejpJZAsXFjuaUTVvbGeY4_Pkn96BkBqso6jPh8EYXPQamqdROzfxZeQTuhw=='
  });
  const org = "LabRadio"

  const fluxQuery = `
    from(bucket: "manzana")
      |> range(start: -1h)
      |> filter(fn: (r) => r._measurement == "WisNode")
      |> limit(n: 100)
  `;

  const executeFluxQuery = async () => {
    try {
      const result = await client.getQueryApi(org).collectRows(fluxQuery);
      console.log(result); // Manipula los resultados según sea necesario
    } catch (error) {
      console.error('Error executing Flux query:', error);
    }
  };

  // Llamar a la función de consulta al montar el componente o en respuesta a algún evento
  useEffect(() => {
    executeFluxQuery();
  }, []);

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