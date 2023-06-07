import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import BotonSidebar from '../BotonSidebar/BotonSidebar';
import { LatLngTuple } from 'leaflet';
import { InfluxDB } from '@influxdata/influxdb-client';
import { useEffect } from 'react';

const opciones = {color: 'blue'}

const MapComponent = ({ sidebarVisible, setSidebarVisible } : any) => {

  // Variables globales
  var chosen_node_color = "white"
  var name_chosen_device = ""
  var geo_data:LatLngTuple[]= []
  const center : LatLngTuple = [42.169890, -8.687653];

  // InfluxDB 
  const client = new InfluxDB({
    url: 'http://192.168.230.100:8086',
    token: 'p-Zmj8O1Lm_9loLZjVRXcN2OqUYrG4Il0XJEc9EWQlGRIY10b1GjO3_-xrtGHn39aohsmSGD9Y6vQhrjqFrYng=='
  });
  const org = "LabRadio"
  let fluxQuery = `
    from(bucket: "manzana")
      |> range(start: -1h)
      |> filter(fn: (r) => r._measurement == "WisNode" and (r.color == "white" or r.color == "black"))
      `
  ;

  const executeFluxQuery = async () => {

    try{
      const result:any = await client.getQueryApi(org).collectRows(fluxQuery);
      console.log(result)
      var white_coords:LatLngTuple[] = []
      var black_coords:LatLngTuple[] = []

      for(var index in result){
        var item = result[index];
        // White Lat
        if(item["table"]==8){
          var white_lat = item["_value"];
        }

        // White Lng
        if(item["table"]==10){
          var white_lng = item["_value"];
        }

        // Black Lat
        if(item["table"]==2){
          var black_lat = item["_value"];
        }

        // Black Lng
        if(item["table"]==4){
          var black_lng = item["_value"];
        }

        white_coords.push([white_lat, white_lng]);
        black_coords.push([black_lat, black_lng]);

      }

      console.log(white_coords)

      if(chosen_node_color === "white"){
        geo_data = white_coords;

      }else if(chosen_node_color === "black"){
        geo_data = black_coords;

      }else{
        geo_data = []
        console.log("No se ha seleccionado un color válido")
      }
      
    }catch(error){
      console.log(error)
      geo_data = []
    }

  }

  useEffect(() => {
    executeFluxQuery();
  }, []);

  const handleToggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const first_position : LatLngTuple = [42.169990, -8.686653];
  const last_position : LatLngTuple = [42.168890, -8.687643];

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

          <Polyline pathOptions={opciones} positions={geo_data}/>

        </MapContainer>
        <BotonSidebar onToggle={handleToggleSidebar}></BotonSidebar>
      </div>
    );
}

export default MapComponent;