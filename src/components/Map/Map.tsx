import { MapContainer, TileLayer, Marker, CircleMarker, Popup, Polyline } from 'react-leaflet'
import BotonSidebar from '../BotonSidebar/BotonSidebar';
import { DivIcon, LatLngExpression, LatLngTuple } from 'leaflet';
import { InfluxDB } from '@influxdata/influxdb-client';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';

var persistent_user = "manzana";

const MapComponent = ({ 
  sidebarVisible, setSidebarVisible, 
  node_color, setNodeColor, 
  selected_time, setSelectedTime,
  current_battery_black, setCurrentBatteryBlack, 
  current_battery_white, setCurrentBatteryWhite,
  global_white_sos, setWhiteSos, 
  global_black_sos, setBlackSos,
  current_username, setUsername
}: any) => {

  // Variables globales
  const interval_time = 5000;
  const [polyline_coords, setPolylineCoords] = useState<LatLngTuple[]>([]);
  const [first_marker_coords, setFirstMarkerCoords] = useState<LatLngExpression>([0, 0]);
  const [last_marker_coords, setLastMarkerCoords] = useState<LatLngExpression>([0, 0]);
  const [markers_visibility, setMarkerVisibility] = useState(false);
  const [global_black_coords_timestamps, setBlackCoordsTimestamps] = useState<string[]>([]);
  const [global_white_coords_timestamps, setWhiteCoordsTimestamps] = useState<string[]>([]);
  var first_marker: LatLngExpression = [0, 0];
  var last_marker: LatLngExpression = [0, 0];
  var white_last_seen = ""
  var black_last_seen = ""

  const teleco_center: LatLngTuple = [42.169890, -8.687653];
  const trelle_center: LatLngTuple = [42.27812, -7.9526337];
  var first_position_text = "";
  var last_position_text = "";

  // Marker Styles
  const markerHtmlStyles = `
    background-color: ${node_color};
    width: 2rem;
    height: 2rem;
    display: block;
    top: -2rem;
    left: -0.7rem;
    position: relative;
    border-radius: 3rem 3rem 0;
    transform: rotate(45deg);
    border: 1px solid ${node_color === 'white'? 'black' : 'white'}`
  const trace_color = { color: 'red' }
  const trace_color1 = { color: 'gray' }
  const custom_icon = new DivIcon({
    className: "my-custom-pin",
    html: `<span style="${markerHtmlStyles}" />`
  });

  // InfluxDB 
  const client = new InfluxDB({
    url: 'http://192.168.230.210:8086',
    token: 'QciodcpDRMOmbP7N5sQK/ZPztGiCZDzxaQ=='
  });
  const org = "LabRadio"

  var executeFluxQuery = async () => {
    try {
    
      let fluxQuery = 
         `from(bucket: "${persistent_user}")
           |> range(start: -${selected_time}m)
           |> filter(fn: (r) => r["_measurement"] == "WisNode" and (r.color == "white" or r.color == "black"))
           |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
           |> group(columns: ["_time"])`;
    
      //console.log("persistent_user: ", persistent_user);
      var result: any = await client.getQueryApi(org).collectRows(fluxQuery);
      //console.log("Resultado de la query para usuario "+persistent_user+"(tiempo de "+selected_time+", color: "+node_color+"): ", result)
      var white_lat_array = []
      var white_lng_array = []
      var black_lat_array = []
      var black_lng_array = []
      var white_coords: LatLngTuple[] = []
      var black_coords: LatLngTuple[] = []

      // Timestamps
      setWhiteCoordsTimestamps([])
      setBlackCoordsTimestamps([])
      var white_coords_timestamps = []
      var black_coords_timestamps = []
      var white_other_timestamps = []
      var black_other_timestamps = []
      white_last_seen = ""
      black_last_seen = ""

      var battery_white_query = 0;
      var battery_black_query = 0;
      var white_sos = false;
      var black_sos = false;

      for (var index in result) {
        var item = result[index];

        if(item['typeMsg'] === 'location'){

          if(item['color'] === 'black'){
            battery_black_query = item['battery']
            var black_lat = item['latitude']
            black_lat_array.push(black_lat)
            var black_lng = item['longitude']
            black_lng_array.push(black_lng)
            var black_time = item['_time']
            black_coords_timestamps.push(black_time)

          }else if(item['color'] === 'white'){
            battery_white_query = item['battery']
            var white_lat = item['latitude']
            white_lat_array.push(white_lat)
            var white_lng = item['longitude']
            white_lng_array.push(white_lng)
            var white_time = item['_time']
            white_coords_timestamps.push(white_time)
          }

        }else if(item['typeMsg'] === 'start_sos'){

          if(item['color'] === 'black') {
            black_sos = true;
            global_black_sos = true;
            setBlackSos(true);
            //console.log("SOS NEGRO")
            var black_time = item['_time']
            black_other_timestamps.push(black_time)

          }else if(item['color'] === 'white'){
            white_sos = true;
            global_white_sos = true;
            setWhiteSos(true);
            //console.log("SOS BLANCO")
            var white_time = item['_time']
            white_other_timestamps.push(white_time)

          }

        }else if(item['typeMsg'] === 'stop_sos'){

          if(item['color'] === 'black') {
            black_sos = false;
            global_black_sos = false;
            setBlackSos(false);
            //console.log("STOP SOS NEGRO")
            var black_time = item['_time']
            black_other_timestamps.push(black_time)

          }else if(item['color'] === 'white'){
            white_sos = false;
            global_white_sos = false;
            setWhiteSos(false)
            //console.log("STOP SOS BLANCO")
            var white_time = item['_time']
            white_other_timestamps.push(white_time)

          }

        }else if(item['typeMsg'] === 'no_location'){

          if(item['color'] === 'black'){
            battery_black_query = item['battery']
            var black_time = item['_time']
            black_other_timestamps.push(black_time)

          }else if(item['color'] === 'white'){
            battery_white_query = item['battery']
            var white_time = item['_time']
            white_other_timestamps.push(white_time)

          }
        }
      }

      //console.log("BLANCO SOS: ", white_sos);
      //console.log("NEGRO  SOS: ", black_sos);

      if (node_color === "white") {

        for (var index in white_lat_array) {
          white_coords.push([white_lat_array[index], white_lng_array[index]])
        }

        // Get most recent timestamp
        const allTimestamps: string[] = [...white_coords_timestamps, ...white_other_timestamps];
        const dateObjects: Date[] = allTimestamps.map((timestamp) => new Date(timestamp));
        const white_mostRecentDateObject: Date = new Date(Math.max(...dateObjects.map((date) => date.getTime())));
        const white_mostRecentTimestamp: string = white_mostRecentDateObject.toISOString();
        //console.log("Timestamp reciente blanco: ", white_mostRecentTimestamp)
        white_last_seen = white_mostRecentTimestamp

        //console.log("Coordenadas del blanco: ", white_coords)
        if(white_coords.length === 0){
          setMarkerVisibility(false);
          setPolylineCoords([])
          setFirstMarkerCoords(first_marker)
          setLastMarkerCoords(last_marker)
          setWhiteCoordsTimestamps([])

        }else{
          setMarkerVisibility(true);
          setPolylineCoords(white_coords)
          first_marker = white_coords[white_coords.length - 1]
          setFirstMarkerCoords(first_marker);
          last_marker = white_coords[0];
          setLastMarkerCoords(last_marker);
          setWhiteCoordsTimestamps(white_coords_timestamps)
        }
        
      } else if (node_color === "black") {

        for (var index in black_lat_array) {
          black_coords.push([black_lat_array[index], black_lng_array[index]])
        }

        // Get most recent timestamp
        const allTimestamps: string[] = [...black_coords_timestamps, ...black_other_timestamps];
        const dateObjects: Date[] = allTimestamps.map((timestamp) => new Date(timestamp));
        const black_mostRecentDateObject: Date = new Date(Math.max(...dateObjects.map((date) => date.getTime())));
        const black_mostRecentTimestamp: string = black_mostRecentDateObject.toISOString();
        //console.log("Timestamp reciente negro: ", black_mostRecentTimestamp)
        black_last_seen = black_mostRecentTimestamp

        //console.log("Coordenadas del negro: ", black_coords)
        if(black_coords.length === 0){
          setMarkerVisibility(false);
          setPolylineCoords([])
          setFirstMarkerCoords(first_marker)
          setLastMarkerCoords(last_marker)
          setBlackCoordsTimestamps([])
          
        }else{
          setMarkerVisibility(true);
          setPolylineCoords(black_coords)
          first_marker = black_coords[black_coords.length - 1]
          setFirstMarkerCoords(first_marker);
          last_marker = black_coords[0];
          setLastMarkerCoords(last_marker);
          setBlackCoordsTimestamps(black_coords_timestamps)
        }

      } else {
        setMarkerVisibility(false);
        setPolylineCoords([])
        setFirstMarkerCoords(first_marker)
        setLastMarkerCoords(last_marker)
        setBlackCoordsTimestamps([])
        setWhiteCoordsTimestamps([])
        //console.log("No se ha seleccionado un color válido")
      }

      current_battery_black = battery_black_query;
      current_battery_white = battery_white_query;
      setCurrentBatteryBlack(battery_black_query);
      setCurrentBatteryWhite(battery_white_query);

    } catch (error) {
      setMarkerVisibility(false);
      //console.log(error)
      setPolylineCoords([])
      setFirstMarkerCoords(first_marker)
      setLastMarkerCoords(last_marker)
      setCurrentBatteryBlack(0);
      setCurrentBatteryWhite(0);
      setBlackCoordsTimestamps([])
      setWhiteCoordsTimestamps([])
    }
  }

  useEffect(() => {
    setNodeColor(node_color)
    setSelectedTime(selected_time)
    //console.log("Tiempo: ", selected_time);
    if(current_username !== undefined){
      persistent_user = current_username;
      //console.log("current_username: ", current_username);
    }
    executeFluxQuery()
    console.log("coordenadas: ", global_black_coords_timestamps)
    const intervalID = setInterval(executeFluxQuery, interval_time);
    return () => {
      clearInterval(intervalID);
    }
  }, [node_color, selected_time, current_username]);

  const handleToggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };
  
  return (
    <div className="map-container">
      <MapContainer center={trelle_center} zoom={16} scrollWheelZoom={true} maxZoom={18} minZoom={13}>
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="/my-tiles/tiles/{z}/{x}/{y}.jpg"/>


        {markers_visibility && <Marker position={first_marker_coords} icon={custom_icon}>
          <Popup>{"Registro más reciente"}
          	<br />
          	{"Coordenadas : "+first_marker_coords.toString().split(",",2)[0].substring(0,8)+" "+first_marker_coords.toString().split(",",2)[1].substring(0,8)}
        	<br />
        	{node_color == "white" && global_white_coords_timestamps[global_white_coords_timestamps.length-1]!==undefined && "Hora: "+global_white_coords_timestamps[global_white_coords_timestamps.length-1].replace('T',' ').replace('Z','')}
        	{node_color == "black" && global_black_coords_timestamps[global_black_coords_timestamps.length-1]!==undefined && "Hora: "+global_black_coords_timestamps[global_black_coords_timestamps.length-1].replace('T',' ').replace('Z','')}
          </Popup>
        </Marker>}

        {markers_visibility && <Marker position={last_marker_coords} icon={custom_icon}>
          <Popup>{"Registro más antiguo"}
          	<br />
          	{"Coordenadas : "+last_marker_coords.toString().split(",",2)[0].substring(0,8)+" "+last_marker_coords.toString().split(",",2)[1].substring(0,8)}
        	<br />
        	{node_color == "white" && global_white_coords_timestamps[0]!==undefined && "Hora: "+global_white_coords_timestamps[0].replace('T',' ').replace('Z','')}
        	{node_color == "black" && global_black_coords_timestamps[0]!==undefined && "Hora: "+global_black_coords_timestamps[0].replace('T',' ').replace('Z','')}
          </Popup>
        </Marker>}

        <Polyline pathOptions={trace_color} positions={polyline_coords} />
        {polyline_coords.map((value, index) => <CircleMarker center={value} pathOptions={trace_color} radius={3}>
        <Popup>
        	{"Coordenadas : "+value[0].toFixed(5)+" "+value[1].toFixed(5)}
        	<br />
        	{node_color == "white" && global_white_coords_timestamps[index]!==undefined && "Hora: "+global_white_coords_timestamps[index].replace('T',' ').replace('Z','')}
        	{node_color == "black" && global_black_coords_timestamps[index]!==undefined && "Hora: "+global_black_coords_timestamps[index].replace('T',' ').replace('Z','')}
        </Popup>
        </CircleMarker>)}

      </MapContainer>
      <BotonSidebar onToggle={handleToggleSidebar}></BotonSidebar>
    </div>
  );
}

export default MapComponent;
