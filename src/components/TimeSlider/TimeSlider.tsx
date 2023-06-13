import './TimeSlider.css'
import Slider from '@mui/material/Slider'
import Box from '@mui/material/Box'

const time_markers = [
    {
        value: 15,
        label: '15 min'
    },
    {
        value: 30,
        label: '30 min'
    },
    {
        value: 45,
        label: '45 min'
    },
    {
        value: 60,
        label: '60 min'
    }
]

const TimeSlider = ({selected_time} : any) => {

    function readTime(value: number){
        selected_time = value
        console.log('chosen time: ', selected_time)
        return '${value}';
    }

    return(
        <Box sx={{width: '14rem'}}>
        <Slider className='time-slider'
            aria-label='Tiempo (minutos)'
            defaultValue={30}
            getAriaValueText={readTime}
            step={15}
            marks={time_markers}
            min={15}
            max={60}
            color='primary'
            sx={{
                marginLeft: '14px',
                color: 'red'
            }}
        />
        </Box>
    )
}

export default TimeSlider;