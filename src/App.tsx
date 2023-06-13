import MapComponent from './components/Map/Map';
import Sidebar from './components/Sidebar/Sidebar';
import './App.css';
import { useState } from 'react';

function App() {

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [node_color, setNodeColor] = useState("white");
  const [selected_time, setSelectedTime] = useState(30)
  
  return (
    <div className='app-container'>
      {sidebarVisible && <Sidebar node_color={node_color} setNodeColor={setNodeColor} selected_time={selected_time}/>}
      <div className="map-container">
        {sidebarVisible ? (
          <MapComponent style={{ width: '100%' }} sidebarVisible={sidebarVisible} setSidebarVisible={setSidebarVisible} node_color={node_color} setNodeColor={setNodeColor}/>
        ) : (
          <MapComponent style={{ width: '100vh' }} sidebarVisible={sidebarVisible} setSidebarVisible={setSidebarVisible} node_color={node_color} setNodeColor={setNodeColor}/>
        )}
      </div>
    </div>
  );
  
}

export default App;