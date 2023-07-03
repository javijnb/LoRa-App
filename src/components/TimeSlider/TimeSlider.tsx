import './TimeSlider.css'
import Slider from '@mui/material/Slider'
import Box from '@mui/material/Box'

const time_markers = [
    {
        value: 90,
        label: '90min'
    },
    {
        value: 180,
        label: '180min'
    },
    {
        value: 270,
        label: '270min'
    },
    {
        value: 360,
        label: '360min'
    },
]

const TimeSlider = ({selected_time, setSelectedTime} : any) => {

    function readTime(value: number){
        selected_time = value
        setSelectedTime(selected_time);
        return '${selected_time}';
    }

    return(
        <Box sx={{width: 'calc(100% - 40px)'}}>
        <Slider className='time-slider'
            aria-label='Tiempo (minutos)'
            defaultValue={180}
            getAriaValueText={readTime}
            step={90}
            marks={time_markers}
            min={90}
            max={360}
            color='primary'
            sx={{
                marginLeft: '20px',
                color: 'green'
            }}
        />
        </Box>
    )
}

export default TimeSlider;
