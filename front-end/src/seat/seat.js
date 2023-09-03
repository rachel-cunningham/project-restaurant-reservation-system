import { React, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import { createTable, listTables, reserveSeat, updateReservationStatus } from "../utils/api";
import Alert from '@mui/material/Alert';
import resimage from './../images/my-res.jpeg';
import {useParams} from "react-router-dom";

function Seat() {
  const history = useHistory();
  const [tables, setTables] = useState([]);
  const [seatsError, setSeatsError] = useState(null);
  const [tableId, setTableId] = useState('');
  const uParam = useParams(); 
  function loadTables() {
    const abortController = new AbortController();
    setSeatsError(null);      
      listTables()
          .then((resp)=>{
              setTables(resp);
              setSeatsError(null);
          })
          .catch((err)=>{
              setTables(null);
              setSeatsError(err.message)
          });
    
    return () => abortController.abort();
  }
  useEffect(() => {
      loadTables();
    }, []);
  const [addTableError, setAddTableError] = useState(null);
  
  const handleChange = ({ target }) => {
    setTableId(target.value)
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    try{
      const result = await reserveSeat(uParam.reservation_id,tableId);
      console.log(result);
      const res = await updateReservationStatus(uParam.reservation_id,'seated',abortController.signal);      
      console.log(res);
      history.push(`/dashboard`);
    }catch(err){
      setSeatsError(err?.message);
      console.log(seatsError);
    }
  };
  const goBack = () => {
    history.goBack(); 
  }
  return (
    <div>
      <h1>Seat the guests</h1>
      <form onSubmit={handleSubmit} style={{ width: '-webkit-fill-available'}}>
        <InputLabel id="demo-simple-select-helper-label">Select a table</InputLabel>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={tableId}
          label="Select Table"
          onChange={handleChange}
          fullWidth
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {tables && Array.isArray(tables) && tables.length>0 && 
             tables.map((table) => (
                <MenuItem value={table.table_id} name={table.table_id}>{table.table_name} - {table.capacity}</MenuItem>                
            ))
          }
        </Select>
            <Stack spacing={2} direction="row" justifyContent="flex-end">
            <Button variant="outlined" onClick={goBack} size="large">Cancel</Button>
            <Button variant="contained" type="submit" size="large">Submit</Button>
            </Stack>  
            {seatsError &&<Alert severity="error">{seatsError}</Alert>}        
      </form>
      
    </div>
  );
}

export default Seat;
