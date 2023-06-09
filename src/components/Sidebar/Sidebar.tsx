import './Sidebar.css'

interface Device {
  id: number;
  name: string;
  color: string;
}

const devices: Device[] = [
  { id: 1, name: 'Blanco' , color: 'white'},
  { id: 2, name: 'Negro', color: 'black'}
];


const Sidebar = ({node_color, setNodeColor}:any) => {

  const handleClick = (color:string) => {
    node_color = color;
    setNodeColor(color);
  }

  return (
    <div className='sidebar'>
    <h2>Lista de dispositivos</h2>
    <ul>
        {devices.map((device) => (
        <button onClick={() => handleClick(device.color)} key={device.id}>{device.name}</button>))}
    </ul>
    </div>
  );
};

export default Sidebar;