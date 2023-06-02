import MapComponent from './components/Map/Map';
import Sidebar from './components/Sidebar/Sidebar';
import './App.css';

function App() {
  return (
    <div className='container'>
      <Sidebar/>
      <MapComponent/>
    </div>
  );
}

export default App;