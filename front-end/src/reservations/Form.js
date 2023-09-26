import { React, useState } from "react";
import { useHistory } from "react-router-dom/";
import { updateReservationData } from "../utils/api";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MuiPhoneNumber from "material-ui-phone-number";
import "./ReservationNew.css";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import resimage from "./../images/my-res.jpeg";
import Alert from "@mui/material/Alert";
import { useParams, useLocation } from "react-router-dom";

function Form({ data, error, onFormSubmit }) {
  const history = useHistory();
  const [reservationsError, setReservationsError] = useState(null);
  const [formData, setFormData] = useState({ ...data });
  const goBack = () => {
    history.goBack();
  };
  const handleChange = ({ target }) => {
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
    setFormData({
      ...formData,
      reservation_time: dayjs(value).format("HH:mm"),
    });
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    formData.people = parseInt(formData.people);
    onFormSubmit(formData);
  };

  return (
    <div>
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
              defaultValue={data.first_name}
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
              defaultValue={data.last_name}
              onChange={handleChange}
              fullWidth
              required
            />
          </Stack>
          <Stack spacing={2} direction="row" sx={{ marginBottom: 4 }}>
            <MuiPhoneNumber
              defaultCountry={"us"}
              name="mobile_number"
              onChange={handlePhone}
              required
              value={data.mobile_number}
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
                defaultValue={dayjs(`${data.reservation_date}`)}
                label="Reservation Date"
                onChange={(newValue) => handleDate(newValue)}
                slotProps={{
                  textField: {
                    helperText: "MM/DD/YYYY",
                    name: "reservation_date",
                  },
                }}
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                label="Reservation Time"
                defaultValue={dayjs(`2022-04-17T${data.reservation_time}`)}
                onChange={(newValue) => handleTime(newValue)}
                slotProps={{ textField: { name: "reservation_time" } }}
              />
            </LocalizationProvider>
          </Stack>
          <Stack spacing={2} direction="row" sx={{ marginBottom: 4 }}>
            <TextField
              id="people"
              label="Party Size"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              variant="standard"
              onChange={handleChange}
              min="1"
              name="people"
              placeholder="1"
              defaultValue={data.people}
              fullWidth
            />
          </Stack>
          <Stack spacing={2} direction="row" justifyContent="flex-end">
            <Button
              variant="outlined"
              id="cancel-edit"
              onClick={goBack}
              size="large"
            >
              Cancel
            </Button>
            <Button variant="contained" type="submit" size="large">
              Submit
            </Button>
          </Stack>
          {error && (
            <Alert className="alert-danger" severity="error">
              {error}
            </Alert>
          )}
        </form>
        <img src={resimage} alt="logo" />
      </Stack>
      <div></div>
    </div>
  );
}

export default Form;
