import './Sidebar.css'

interface Device {
  id: number;
  name: string;
}

const devices: Device[] = [
  { id: 1, name: 'Dispositivo 1' },
  { id: 2, name: 'Dispositivo 2' },
  { id: 3, name: 'Dispositivo 3' },
  { id: 4, name: 'Dispositivo 4' },
  { id: 5, name: 'Dispositivo 5' },
];

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Lista de dispositivos</h2>
      <ul>
        {devices.map((device) => (
          <li key={device.id}>{device.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;