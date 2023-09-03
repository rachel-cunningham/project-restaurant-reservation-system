import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { next, previous, today } from '../utils/date-time';

export default function ReservationsNav({date,onDateChange}) {
    
    const changeDate = type=>()=>{        
        switch(type) {
            case 'next':
                onDateChange(next(date))
              break;
            case 'prev':
                onDateChange(previous(date))
              break;
            case 'today':
                onDateChange(today())
                break;  
            default:
              
          }
    }
  return (
    <div className='nav-buttons'>
        <Stack spacing={2} direction="row">
        <Button variant="contained" onClick={changeDate('prev')}>Previous Day</Button>
        <Button variant="contained" onClick={changeDate('today')}>Today</Button>
        <Button variant="contained" onClick={changeDate('next')}>Next Day</Button>
        </Stack>
    </div>
  );
}