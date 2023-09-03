import React, { useEffect, useState } from "react";
import Tables from "../tables/Tables";
import "./Dashboard.css";
import Reservations from "./Reservations";
import ReservationsNav from "./ReservationsNav";
import Stack from '@mui/material/Stack';
/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */

function Dashboard({ date }){
  const [displayDate, setDisplayDate] = useState(date);
  const handleDate=(date)=>{
    setDisplayDate(date);
  }
  React.useEffect(()=>{
    const queryParameters = new URLSearchParams(window.location.search)
    const dateParam = queryParameters.get("date")
    if(dateParam){
      setDisplayDate(dateParam);
    }    
  },[])
  return (
    <main>  
      <Stack spacing={2} direction="row">
        <div className="res-col">
            <h3 className="header-res">Reservations for {displayDate}</h3>
            <Reservations keyString='date' value={displayDate} onDateChange={handleDate}></Reservations>
        </div>
        <div className="table-col">
            <h3 className="header-table">Tables</h3>
            <Tables></Tables>
        </div>
      </Stack>
      <ReservationsNav date={displayDate} onDateChange={handleDate}></ReservationsNav>
    </main>
  );
}

export default Dashboard;
