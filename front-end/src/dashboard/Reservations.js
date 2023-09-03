import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { listReservations, updateReservationStatus } from '../utils/api';
import "./ReservationsNav.css"
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import "./Reservation.css"
import { Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

export default function Reservations({keyString,value,onDateChange}) {
    const history = useHistory();
    const [reservations, setReservations] = useState([]);
    const [reservationsError, setReservationsError] = useState(null);
    useEffect(loadDashboard, [keyString, value]);
    const [cancelError, setCancelError] = useState(null);
    const [open, setOpen] = React.useState(false);
    const [reservationId, setReservationId] = React.useState(null);
    const handleClose = () => {
        setOpen(false);
    };
    function loadDashboard() {
      const abortController = new AbortController();
      setReservationsError(null);
      const obj ={}
      obj[keyString] = value;
      if(value){
          listReservations(obj, abortController.signal)
            .then((resp)=>{
                setReservations(resp);
                setReservationsError(null);
            })
            .catch((err)=>{
                setReservations(null);
                setReservationsError(err.message)
            });
      }
      return () => abortController.abort();
    }
    const markSeated=reservation_id=>()=>{
        history.push(`/reservations/${reservation_id}/seat`);
    }
    const editReservation=reservation=>()=>{
        history.push(`/reservations/${reservation.reservation_id}/edit`,reservation);
    }
    const openDialog=reservation_id=>async ()=>{
        setOpen(true);
        setReservationId(reservation_id);
    }
    async function cancelReservation (){  
        const abortController = new AbortController();
        try{
            const res = await updateReservationStatus(reservationId,'cancelled',abortController.signal);      
            console.log(res);
            setOpen(false);
            loadDashboard();
        }catch(err){
            setCancelError(err?.message);
            console.log(cancelError);
        }
    }
  return (
    <div>
        {reservationsError}
        <div>{Array.isArray(reservations) && reservations.length>0 &&
            reservations.map((reservation) => (
                <div className='main-card'>
                    <div className='card-res'>
                        <div className='info'>
                            <div className='name-wrapper'>
                                <h3 className='name'>{reservation.first_name}</h3>
                                <h3 className='name'>{reservation.last_name}</h3>
                            </div>
                            
                        </div>
                        <div className='subinfo-res'>
                            <div className='people'>Party of {reservation.people}</div>
                            <div className='desc-at'>At: {reservation.reservation_time}</div>
                        </div>
                        <div className='subinfo-res'>
                            <div className='desc-ct'>mobile: {reservation.mobile_number}</div>
                            <div className='people'>{reservation.status.toUpperCase()}</div>
                        </div>    
                    </div>
                    <div className='buttons'>
                        <Stack direction="column" spacing={2} alignItems='left'>                            
                            {reservation.status?.toLowerCase()==='booked' && <Button variant="contained" onClick={markSeated(reservation.reservation_id)}>Seat</Button>}
                            {reservation.status?.toLowerCase()!=='booked' && <Button disabled>Seated</Button>}
                            {reservation.status?.toLowerCase()==='booked' && <Button variant="contained" onClick={editReservation(reservation)}>Edit</Button>}
                            {reservation.status?.toLowerCase()!=='booked' && <Button variant="contained" disabled onClick={editReservation(reservation)}>Edit</Button>}
                            <Button variant="outlined" onClick={openDialog(reservation.reservation_id)}>Cancel</Button>                            
                        </Stack>
                        {cancelError &&<Alert severity="error">{cancelError}</Alert>}        
                    </div>
                </div>
            ))
            
            }
        </div>
        <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          Do you want to cancel this reservation? This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={cancelReservation} autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}