import './Sidebar.css'
import { Button } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TimeSlider from '../TimeSlider/TimeSlider';
import BatteryGauge from 'react-battery-gauge';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';

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
  black_sos, setBlackSos,
  current_username, setUsername
}:any) => {

  const handleClick = (color:string) => {
    node_color = color;
    setNodeColor(color);
  }

  const handleSliderClick = () => {
    setSelectedTime(selected_time);
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(event.target.value === '' ? '' : Number(event.target.value));
  };

  const handleChange = (event: SelectChangeEvent) => {
    current_username = event.target.value as string;
    setUsername(event.target.value as string);
  }

  return (
    
    <div className='sidebar'>

      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel>Usuario</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={current_username}
            label="Usuario"
            onChange={handleChange}
          >
            <MenuItem value={'manzana'}>Manzana</MenuItem>
            <MenuItem value={'pera'}>Pera</MenuItem>
            <MenuItem value={'platano'}>Plátano</MenuItem>
            <MenuItem value={'naranja'}>Naranja</MenuItem>
            <MenuItem value={'fresa'}>Fresa</MenuItem>
            <MenuItem value={'limon'}>Limón</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <br/>
      <div className='linea'/>
      <br/>

      <ThemeProvider theme={white_theme}>
        <Button color="white" size="medium" variant='contained' onClick={() => handleClick('white')}>Ver trayectorias del dispositivo Blanco </Button>
      </ThemeProvider>
      <br/>
      <div className='info-container'>
        <BatteryGauge maxValue={100} value={current_battery_white} size={125}/>
        {white_sos ? 
          <Alert variant='filled' severity="error">La persona se ha perdido</Alert> 
          : 
          <Alert variant='filled' severity="success">La persona está bien</Alert>}
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
          <Alert variant='filled' severity="error">La persona se ha perdido</Alert> 
          : 
          <Alert variant='filled' severity="success">La persona está bien</Alert>}
      </div>

      <br/>
      <div className='linea'/>
      <br/>

      <h4>Mostrar trayectoria desde hace:</h4>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs>        
          <TimeSlider className="time-slider" onClick={handleSliderClick()} selected_time={selected_time} setSelectedTime={setSelectedTime}/>
        </Grid>
        <Grid item>
          <Input
            value={selected_time}
            size="small"
            onChange={handleInputChange}
            inputProps={{
              min: 0,
              max: 180,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
        </Grid>
      </Grid>
      

      <br/>
      <div className='linea'/>
      <br/>

    </div>
  );
};

export default Sidebar;
