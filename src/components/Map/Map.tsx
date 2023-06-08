import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import BotonSidebar from '../BotonSidebar/BotonSidebar';
import { LatLngExpression, LatLngTuple } from 'leaflet';
import { InfluxDB } from '@influxdata/influxdb-client';
import { useEffect, useState } from 'react';

const opciones = {color: 'blue'}

const MapComponent = ({ sidebarVisible, setSidebarVisible, node_color, setNodeColor} : any) => {

  // Variables globales
  const [polyline_coords, setPolylineCoords] = useState<LatLngTuple[]>([]);
  const [first_marker_coords, setFirstMarkerCoords] = useState<LatLngExpression>([0,0]);
  const [last_marker_coords, setLastMarkerCoords] = useState<LatLngExpression>([0,0]);

  var first_marker:LatLngExpression = [0,0];
  var last_marker:LatLngExpression  = [0,0];

  //var node_color = "white"
  const center : LatLngTuple = [42.169890, -8.687653];
  var first_position_text = "";
  var last_position_text  = "";

  // InfluxDB 
  const client = new InfluxDB({
    url: 'http://192.168.230.100:8086',
    token: 'QciodcpDRMOmbP7N5sQK/ZPztGiCZDzxaQ=='
  });
  const org = "LabRadio"
  let fluxQuery = `
    from(bucket: "manzana")
      |> range(start: -1h)
      |> filter(fn: (r) => r._measurement == "WisNode" and (r.color == "white" or r.color == "black"))
      `
  ;

  var executeFluxQuery = async () => {

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

      }

      if(node_color === "white"){

        for(var index in white_lat_array){
          white_coords.push([white_lat_array[index], white_lng_array[index]])
        }

        console.log("Blanco")
        console.log(white_coords)
        setPolylineCoords(white_coords)
        first_marker = white_coords[white_coords.length - 1]
        setFirstMarkerCoords(first_marker);
        last_marker = white_coords[0];
        setLastMarkerCoords(last_marker);

      }else if(node_color === "black"){

        for(var index in black_lat_array){
          black_coords.push([black_lat_array[index], black_lng_array[index]])
        }
        

        console.log("Negro")
        console.log(black_coords)
        setPolylineCoords(black_coords)
        first_marker = black_coords[black_coords.length - 1]
        setFirstMarkerCoords(first_marker);
        last_marker = black_coords[0];
        setLastMarkerCoords(last_marker);

      }else{
        setPolylineCoords([])
        setFirstMarkerCoords(first_marker)
        setLastMarkerCoords(last_marker)
        console.log("No se ha seleccionado un color válido")
      }
      
    }catch(error){
      console.log(error)
      setPolylineCoords([])
      setFirstMarkerCoords(first_marker)
      setLastMarkerCoords(last_marker)
    }

  }

  useEffect(() => {
    setNodeColor(node_color)
    console.log("Cambio en el color en el componente Map")
    executeFluxQuery();
  }, [node_color]);

  const handleToggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

    return (
      <div className="map-container">
        <MapContainer center={center} zoom={18} scrollWheelZoom={true}>
          <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"/>

          <Marker position={first_marker_coords}>
            <Popup>Registro más reciente<br />{first_position_text}</Popup>
          </Marker>

          <Marker position={last_marker_coords}>
            <Popup>Registro más antiguo<br />{last_position_text}</Popup>
          </Marker>

          <Polyline pathOptions={opciones} positions={polyline_coords}/>

        </MapContainer>
        <BotonSidebar onToggle={handleToggleSidebar}></BotonSidebar>
      </div>
    );
}

export default MapComponent;