import './Sidebar.css'
import { Button } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TimeSlider from '../TimeSlider/TimeSlider';

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

const Sidebar = ({node_color, setNodeColor, selected_time, setSelectedTime}:any) => {

  const handleClick = (color:string) => {
    node_color = color;
    setNodeColor(color);
  }

  const handleSliderClick = () => {
    setSelectedTime(selected_time);
    console.log("Tiempo en sidebar: ", selected_time)
  }

  return (
    
    <div className='sidebar'>
    <h2>Lista de dispositivos</h2>
      <ThemeProvider theme={white_theme}>
        <Button color="white" size="medium" variant='contained' onClick={() => handleClick('white')}>Dispositivo Blanco </Button>
      </ThemeProvider>
        <br/><br/>
      <ThemeProvider theme={black_theme}>
        <Button color="black" size="medium" variant='contained' onClick={() => handleClick('black')}>Dispositivo Negro </Button>
      </ThemeProvider>
        <br/><br/>
      <h4>Mostrar trayectoria desde hace:</h4>
      <TimeSlider onClick={handleSliderClick()} selected_time={selected_time} setSelectedTime={setSelectedTime}/>
    </div>
  );
};

export default Sidebar;