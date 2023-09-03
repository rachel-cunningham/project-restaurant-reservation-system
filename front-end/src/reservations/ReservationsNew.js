import { React, useState } from "react";
import { useHistory } from "react-router-dom/";
import { createReservation } from "../utils/api";
import { today } from "../utils/date-time";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MuiPhoneNumber from "material-ui-phone-number";
import "./ReservationNew.css";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs, { Dayjs } from "dayjs";
import resimage from "./../images/my-res.jpeg";
import Alert from "@mui/material/Alert";
function NewReservation() {
  const history = useHistory();
  const [reservationsError, setReservationsError] = useState(null);

  const goBack = () => {
    history.goBack();
  };

  const goToReservation = () => {
    history.push(`/dashboard?date=${formData.reservation_date}`);
  };

  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: today(),
    reservation_time: "",
    people: 1,
    status: "booked",
  };

  const [formData, setFormData] = useState({ ...initialFormState });
  const handleChange = ({ target }) => {
    console.log(target);
    if (target) {
      setFormData({
        ...formData,
        [target.name]: target.value,
      });
    }
  };
  function handlePhone(value) {
    setFormData({
      ...formData,
      mobile_number: value,
    });
  }
  function handleDate(value) {
    setFormData({
      ...formData,
      reservation_date: dayjs(value).format("YYYY-MM-DD"),
    });
  }
  function handleTime(value) {
    console.log(dayjs(value).format("HH:mm"));
    setFormData({
      ...formData,
      reservation_time: dayjs(value).format("HH:mm"),
    });
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    formData.people = parseInt(formData.people);
    createReservation({ data: formData }, abortController.signal)
      .then((resp) => {
        goToReservation();
      })
      .catch((err) => {
        setReservationsError(err.message);
      });
  };

  return (
    <div>
      <h1>Create Reservation</h1>
      <Stack
        spacing={2}
        sx={{ marginBottom: 4 }}
        direction={{
          xs: "column",
          sm: "column",
          md: "column",
          lg: "row",
          xl: "row",
        }}
      >
        <form onSubmit={handleSubmit}>
          <Stack spacing={2} direction="row" sx={{ marginBottom: 4 }}>
            <TextField
              type="text"
              variant="outlined"
              color="secondary"
              label="First Name"
              name="first_name"
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              type="text"
              variant="outlined"
              color="secondary"
              label="Last Name"
              name="last_name"
              onChange={handleChange}
              fullWidth
              required
            />
          </Stack>
          <Stack spacing={2} direction="row" sx={{ marginBottom: 4 }}>
            <MuiPhoneNumber
              defaultCountry={"us"}
              onChange={handlePhone}
              required
              fullWidth
            ></MuiPhoneNumber>
          </Stack>
          <Stack
            spacing={2}
            direction="row"
            sx={{ marginBottom: 4 }}
            useFlexGap
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Reservation Date"
                onChange={(newValue) => handleDate(newValue)}
                slotProps={{
                  textField: {
                    helperText: "MM/DD/YYYY",
                  },
                }}
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                label="Reservation Time"
                onChange={(newValue) => handleTime(newValue)}
              />
            </LocalizationProvider>
          </Stack>
          <Stack spacing={2} direction="row" sx={{ marginBottom: 4 }}>
            <TextField
              id="people"
              label="Party Size"
              InputLabelProps={{
                shrink: true,
              }}
              variant="standard"
              onChange={handleChange}
              InputProps={{
                inputProps: {
                  type: "number",
                  min: 1,
                },
              }}
              name="people"
              placeholder="1"
              fullWidth
            />
          </Stack>
          <Stack spacing={2} direction="row" justifyContent="flex-end">
            <Button variant="outlined" onClick={goBack} size="large">
              Cancel
            </Button>
            <Button variant="contained" type="submit" size="large">
              Submit
            </Button>
          </Stack>
          {reservationsError && (
            <Alert severity="error">{reservationsError}</Alert>
          )}
        </form>
        <img src={resimage} alt="logo" />
      </Stack>
      <div></div>
    </div>
  );
}

export default NewReservation;
