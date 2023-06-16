import './Sidebar.css'
import { Button } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TimeSlider from '../TimeSlider/TimeSlider';
import BatteryGauge from 'react-battery-gauge';
import Alert from '@mui/material/Alert';

const white_theme = createTheme({
  palette: {
    white: {
      main: 'white',
      contrastText: 'black',
    }
  }
})

const black_theme = createTheme({
  palette: {
    black: {
      main: 'black',
      contrastText: 'white',
    }
  }
})

declare module '@mui/material/styles' {
  interface Palette {
    white: Palette['primary'];
    black: Palette['primary'];
  }
  interface PaletteOptions {
    white?: PaletteOptions['primary'];
    black?: PaletteOptions['primary'];
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    white: true;
    black: true;
  }
}

const Sidebar = ({
  node_color, setNodeColor, 
  selected_time, setSelectedTime, 
  current_battery_black, setCurrentBatteryBlack, 
  current_battery_white, setCurrentBatteryWhite,
  white_sos, setWhiteSos, 
  black_sos, setBlackSos
}:any) => {

  const handleClick = (color:string) => {
    node_color = color;
    setNodeColor(color);
  }

  const handleSliderClick = () => {
    setSelectedTime(selected_time);
  }

  return (
    
    <div className='sidebar'>
      <ThemeProvider theme={white_theme}>
        <Button color="white" size="medium" variant='contained' onClick={() => handleClick('white')}>Ver trayectorias del dispositivo Blanco </Button>
      </ThemeProvider>
      <br/>
      <div className='info-container'>
        <BatteryGauge maxValue={100} value={current_battery_white} size={125}/>
        {white_sos ? 
          <Alert variant='filled' severity="error">Manolo se ha perdido</Alert> 
          : 
          <Alert variant='filled' severity="success">Manolo está bien</Alert>}
      </div>

      <br/>
      <div className='linea'/>
      <br/>

      <ThemeProvider theme={black_theme}>
        <Button color="black" size="medium" variant='contained' onClick={() => handleClick('black')}>Ver trayectorias del dispositivo Negro </Button>
      </ThemeProvider>
      <br/>
      <div className='info-container'>
        <BatteryGauge maxValue={100} value={current_battery_black} size={125}/>
        {black_sos ? 
          <Alert variant='filled' severity="error">Dolores se ha perdido</Alert> 
          : 
          <Alert variant='filled' severity="success">Dolores está bien</Alert>}
      </div>

      <br/>
      <div className='linea'/>
      <br/>

      <h4>Mostrar trayectoria desde hace:</h4>
      <TimeSlider className="time-slider" onClick={handleSliderClick()} selected_time={selected_time} setSelectedTime={setSelectedTime}/>

      <br/>
      <div className='linea'/>
      <br/>

    </div>
  );
};

export default Sidebar;