import React, { useEffect, useState } from "react";
import MuiPhoneNumber from 'material-ui-phone-number';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { listReservations } from "../utils/api";
import Reservations from "../dashboard/Reservations";
function SearchByPhone() {
  const [phone, setPhone] = useState("");
  const initialFormState = {
    mobile_number: "",
  };
  const [formData, setFormData] = useState({ ...initialFormState });
  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormData({
      ...formData,
      'mobile_number': phone,
    });
  };
  function handlePhone(value) {
    setPhone(value)
 }
  return (
    <div>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2} direction="row" sx={{marginBottom: 4,marginY:5,marginX:5}} justifyContent='center'>
              <MuiPhoneNumber defaultCountry={'us'} onChange={handlePhone} required label="Enter a customer's phone number"></MuiPhoneNumber>
              <Button variant="contained" type="submit" size="large">Find</Button>
          </Stack>
        </form>
        <Reservations keyString='mobile_number' value={formData.mobile_number}></Reservations>
        
    </div>
  );
}

export default SearchByPhone;
