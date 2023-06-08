import MapComponent from './components/Map/Map';
import Sidebar from './components/Sidebar/Sidebar';
import './App.css';
import { useState } from 'react';

function App() {

  const [sidebarVisible, setSidebarVisible] = useState(false);
  var node_color = "white";

  return (
    <div className='app-container'>
      {sidebarVisible && <Sidebar />}
      <div className="map-container">
        {sidebarVisible ? (
          <MapComponent style={{ width: '100%' }} sidebarVisible={sidebarVisible} setSidebarVisible={setSidebarVisible}/>
        ) : (
          <MapComponent style={{ width: '100vh' }} sidebarVisible={sidebarVisible} setSidebarVisible={setSidebarVisible}/>
        )}
      </div>
    </div>
  );
  
}

export default App;