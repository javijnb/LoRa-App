import { MapContainer, TileLayer, Marker, CircleMarker, Popup, Polyline } from 'react-leaflet'
import BotonSidebar from '../BotonSidebar/BotonSidebar';
import { DivIcon, LatLngExpression, LatLngTuple } from 'leaflet';
import { InfluxDB } from '@influxdata/influxdb-client';
import { useEffect, useState } from 'react';

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
  var first_marker: LatLngExpression = [0, 0];
  var last_marker: LatLngExpression = [0, 0];

  const teleco_center: LatLngTuple = [42.169890, -8.687653];
  const trelle_center : LatLngTuple = [42.2781204539441, -7.952633793013809];
  const trelle_center2 : LatLngTuple[] = [[42.2781204539441, -7.952633793013809],[42.26, -7.94],[42.28, -7.96]];
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
    border: 1px solid ${node_color == 'white'? 'black' : 'white'}`
  const trace_color = { color: 'red' }
  const custom_icon = new DivIcon({
    className: "my-custom-pin",
    html: `<span style="${markerHtmlStyles}" />`
  });

  // InfluxDB 
  const client = new InfluxDB({
    url: 'http://192.168.230.100:8086',
    token: 'QciodcpDRMOmbP7N5sQK/ZPztGiCZDzxaQ=='
  });
  const org = "LabRadio"
  
  let fluxQuery = `
    from(bucket: "${current_username}")
      |> range(start: -${selected_time}m)
      |> filter(fn: (r) => r["_measurement"] == "WisNode" and (r.color == "white" or r.color == "black"))
      |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
      |> group(columns: ["_time"])
      `;

  var executeFluxQuery = async () => {

    try {
      const result: any = await client.getQueryApi(org).collectRows(fluxQuery);
      console.log("Resultado de la query para usuario "+current_username+"(tiempo de "+selected_time+"): ", result)
      var white_lat_array = []
      var white_lng_array = []
      var black_lat_array = []
      var black_lng_array = []
      var white_coords: LatLngTuple[] = []
      var black_coords: LatLngTuple[] = []
      var battery_white_query = 0;
      var battery_black_query = 0;
      var white_sos = false;
      var black_sos = false;

      for (var index in result) {
        var item = result[index];

        if(item['typeMsg'] == 'location'){

          if(item['color'] == 'black'){
            battery_black_query = item['battery']
            var black_lat = item['latitude']
            black_lat_array.push(black_lat)
            var black_lng = item['longitude']
            black_lng_array.push(black_lng)

          }else if(item['color'] == 'white'){
            battery_white_query = item['battery']
            var white_lat = item['latitude']
            white_lat_array.push(white_lat)
            var white_lng = item['longitude']
            white_lng_array.push(white_lng)
          }

        }else if(item['typeMsg'] == 'start_sos'){

          if(item['color'] == 'black') {
            black_sos = true;
            global_black_sos = true;
            setBlackSos(true);
            console.log("SOS NEGRO")
          }else if(item['color'] == 'white'){
            white_sos = true;
            global_white_sos = true;
            setWhiteSos(true);
            console.log("SOS BLANCO")
          }

        }else if(item['typeMsg'] == 'stop_sos'){

          if(item['color'] == 'black') {
            black_sos = false;
            global_black_sos = false;
            setBlackSos(false);
            console.log("STOP SOS NEGRO")
          }else if(item['color'] == 'white'){
            white_sos = false;
            global_white_sos = false;
            setWhiteSos(false)
            console.log("STOP SOS BLANCO")
          }

        }else if(item['typeMsg'] == 'no_location'){
          if(item['color'] == 'black'){
            battery_black_query = item['battery']

          }else if(item['color'] == 'white'){
            battery_white_query = item['battery']
          }
        }
      }

      console.log("BLANCO SOS: ", white_sos);
      console.log("NEGRO  SOS: ", black_sos);

      if (node_color === "white") {

        for (var index in white_lat_array) {
          white_coords.push([white_lat_array[index], white_lng_array[index]])
        }

        //console.log("Coordenadas del blanco: ", white_coords)
        if(white_coords.length == 0){
          setMarkerVisibility(false);
          setPolylineCoords([])
          setFirstMarkerCoords(first_marker)
          setLastMarkerCoords(last_marker)

        }else{
          setMarkerVisibility(true);
          setPolylineCoords(white_coords)
          first_marker = white_coords[white_coords.length - 1]
          setFirstMarkerCoords(first_marker);
          last_marker = white_coords[0];
          setLastMarkerCoords(last_marker);
        }
        
      } else if (node_color === "black") {

        for (var index in black_lat_array) {
          black_coords.push([black_lat_array[index], black_lng_array[index]])
        }

        //console.log("Coordenadas del negro: ", black_coords)
        if(black_coords.length == 0){
          setMarkerVisibility(false);
          setPolylineCoords([])
          setFirstMarkerCoords(first_marker)
          setLastMarkerCoords(last_marker)
        }else{
          setMarkerVisibility(true);
          setPolylineCoords(black_coords)
          first_marker = black_coords[black_coords.length - 1]
          setFirstMarkerCoords(first_marker);
          last_marker = black_coords[0];
          setLastMarkerCoords(last_marker);
        }

      } else {
        setMarkerVisibility(false);
        setPolylineCoords([])
        setFirstMarkerCoords(first_marker)
        setLastMarkerCoords(last_marker)
        console.log("No se ha seleccionado un color válido")
      }

      current_battery_black = battery_black_query;
      current_battery_white = battery_white_query;
      setCurrentBatteryBlack(battery_black_query);
      setCurrentBatteryWhite(battery_white_query);

    } catch (error) {
      setMarkerVisibility(false);
      console.log(error)
      setPolylineCoords([])
      setFirstMarkerCoords(first_marker)
      setLastMarkerCoords(last_marker)
      setCurrentBatteryBlack(0);
      setCurrentBatteryWhite(0);
    }
  }

  useEffect(() => {
    setNodeColor(node_color)
    setSelectedTime(selected_time)
    executeFluxQuery()
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
      <MapContainer center={trelle_center} zoom={16} scrollWheelZoom={true} maxZoom={18} minZoom={15}>
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="/Tiles/{z}/{x}/{y}.png" />
        <Marker position={trelle_center}><Popup>Trelle</Popup></Marker>
        {trelle_center2.map((value, index) => <CircleMarker center={value} pathOptions={trace_color} radius={5}><Popup>{index}</Popup></CircleMarker>)}
	<Polyline
	  pathOptions={trace_color}
	  positions={trelle_center2}
	/> 
	      

        {markers_visibility && <Marker position={first_marker_coords} icon={custom_icon}>
          <Popup>Registro más reciente<br />{first_position_text}</Popup>
        </Marker>}

        {markers_visibility && <Marker position={last_marker_coords} icon={custom_icon}>
          <Popup>Registro más antiguo<br />{last_position_text}</Popup>
        </Marker>}

        <Polyline pathOptions={trace_color} positions={polyline_coords} />

      </MapContainer>
      <BotonSidebar onToggle={handleToggleSidebar}></BotonSidebar>
    </div>
  );
}

export default MapComponent;
