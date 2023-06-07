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
  var first_position:LatLngTuple = [0,0];
  var last_position:LatLngTuple = [0,0];
  var first_position_text = "";
  var last_position_text = "";

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
      var white_lat_array = []
      var white_lng_array = []
      var black_lat_array = []
      var black_lng_array = []
      var white_coords:LatLngTuple[] = []
      var black_coords:LatLngTuple[] = []

      for(var index in result){
        var item = result[index];
        // White Lat
        if(item["table"]==8){
          var white_lat = item["_value"];
          white_lat_array.push(white_lat)
        }

        // White Lng
        if(item["table"]==10){
          var white_lng = item["_value"];
          white_lng_array.push(white_lng)
        }

        // Black Lat
        if(item["table"]==2){
          var black_lat = item["_value"];
          black_lat_array.push(black_lat)
        }

        // Black Lng
        if(item["table"]==4){
          var black_lng = item["_value"];
          black_lng_array.push(black_lng)
        }

        white_coords.push([white_lat, white_lng]);
        black_coords.push([black_lat, black_lng]);

      }

      for(var index in white_lat_array){
        white_coords.push([white_lat_array[index], white_lng_array[index]])
        black_coords.push([black_lat_array[index], black_lat_array[index]])
      }

      if(chosen_node_color === "white"){
        geo_data = white_coords;
        first_position = white_coords[white_coords.length - 1]
        last_position = white_coords[0]

      }else if(chosen_node_color === "black"){
        geo_data = black_coords;
        first_position = black_coords[black_coords.length - 1]
        last_position = black_coords[0]

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

    return (
      <div className="map-container">
        <MapContainer center={center} zoom={18} scrollWheelZoom={true}>
          <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"/>

          <Marker position={first_position}>
            <Popup>Registro más antiguo<br />{first_position_text}</Popup>
          </Marker>

          <Marker position={last_position}>
            <Popup>Registro más reciente<br />{last_position_text}</Popup>
          </Marker>

          <Polyline pathOptions={opciones} positions={geo_data}/>

        </MapContainer>
        <BotonSidebar onToggle={handleToggleSidebar}></BotonSidebar>
      </div>
    );
}

export default MapComponent;