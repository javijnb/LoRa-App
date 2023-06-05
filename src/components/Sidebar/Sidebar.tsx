import './Sidebar.css'

interface Device {
  id: number;
  name: string;
}

const devices_blancos: Device[] = [
  { id: 1, name: 'Blanco 1' },
  { id: 2, name: 'Blanco 2' },
  { id: 3, name: 'Blanco 3' },
  { id: 4, name: 'Blanco 4' },
  { id: 5, name: 'Blanco 5' },
  { id: 6, name: 'Blanco 6' },
];

const devices_negros: Device[] = [
  { id: 1, name: 'Negro 1' },
  { id: 2, name: 'Negro 2' },
  { id: 3, name: 'Negro 3' },
  { id: 4, name: 'Negro 4' },
  { id: 5, name: 'Negro 5' },
  { id: 6, name: 'Negro 6' },
];

const Sidebar = () => {

    return (
        <div className='sidebar'>
        <h2>Lista de dispositivos</h2>
        <ul>
            {devices_negros.map((device) => (
            <li key={device.id}>{device.name}</li>))}
            {devices_blancos.map((device) => (
            <li key={device.id}>{device.name}</li>))}
        </ul>
        </div>
    );
};

export default Sidebar;