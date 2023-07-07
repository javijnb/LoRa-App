import MapComponent from './components/Map/Map';
import Sidebar from './components/Sidebar/Sidebar';
import './App.css';
import { useState } from 'react';

function App() {

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [node_color, setNodeColor] = useState("white");
  const [selected_time, setSelectedTime] = useState(30);
  const [current_battery_white, setCurrentBatteryWhite] = useState(0);
  const [current_battery_black, setCurrentBatteryBlack] = useState(0);
  const [white_sos, setWhiteSos] = useState(false);
  const [black_sos, setBlackSos] = useState(false);
  const [current_username, setUsername] = useState('manzana');
  
  return (
    <div className='app-container'>
      {sidebarVisible &&
      <Sidebar 
        node_color={node_color} setNodeColor={setNodeColor} 
        selected_time={selected_time} setSelectedTime={setSelectedTime}
        current_battery_black={current_battery_black} setCurrentBatteryBlack={setCurrentBatteryBlack}
        current_battery_white={current_battery_white} setCurrentBatteryWhite={setCurrentBatteryWhite}
        white_sos={white_sos} setWhiteSos={setWhiteSos} 
        black_sos={black_sos} setBlackSos={setBlackSos}
        current_username={current_username} setUsername={setUsername}
      />}
      <div className="map-container">
        {sidebarVisible ? (
          <MapComponent 
            style={{ width: '100%' }} sidebarVisible={sidebarVisible} setSidebarVisible={setSidebarVisible}
            node_color={node_color} setNodeColor={setNodeColor} 
            selected_time={selected_time} setSelectedTime={setSelectedTime}
            current_battery_black={current_battery_black} setCurrentBatteryBlack={setCurrentBatteryBlack}
            current_battery_white={current_battery_white} setCurrentBatteryWhite={setCurrentBatteryWhite}
            global_white_sos={white_sos} setWhiteSos={setWhiteSos} 
            global_black_sos={black_sos} setBlackSos={setBlackSos}
            current_username={current_username} setUsername={setUsername}
          />
        ) : (
          <MapComponent 
            style={{ width: '100vh' }} sidebarVisible={sidebarVisible} setSidebarVisible={setSidebarVisible} 
            node_color={node_color} setNodeColor={setNodeColor} 
            selected_time={selected_time} setSelectedTime={setSelectedTime}
            current_battery_black={current_battery_black} setCurrentBatteryBlack={setCurrentBatteryBlack}
            current_battery_white={current_battery_white} setCurrentBatteryWhite={setCurrentBatteryWhite}
            global_white_sos={white_sos} setWhiteSos={setWhiteSos} 
            global_black_sos={black_sos} setBlackSos={setBlackSos}
            current_username={current_username} setUsername={setUsername}
          />
        )}
      </div>
    </div>
  );
  
}

export default App;
