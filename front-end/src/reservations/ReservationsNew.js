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
import dayjs from "dayjs";
import resimage from "./../images/my-res.jpeg";
import Alert from "@mui/material/Alert";
import Form from "./Form";

function NewReservation() {
  const history = useHistory();
  const [reservationsError, setReservationsError] = useState(null);

  const goBack = () => {
    history.goBack();
  };

  const goToReservation = (reservation_date) => {
    history.push(`/dashboard?date=${reservation_date}`);
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
  const handleSubmit = async (data) => {
    const abortController = new AbortController();
    formData.people = parseInt(formData.people);
    try {
      const resp = await createReservation(
        { data: data },
        abortController.signal
      );
      if (resp) {
        goToReservation(data.reservation_date);
      }
    } catch (err) {
      setReservationsError(err.message);
    }
  };

  return (
    <div>
      <h1>Create Reservation</h1>
      <Form
        data={formData}
        error={reservationsError}
        onFormSubmit={handleSubmit}
      ></Form>
    </div>
  );
}

export default NewReservation;
