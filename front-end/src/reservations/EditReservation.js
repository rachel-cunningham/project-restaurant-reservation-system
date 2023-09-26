import { React, useState } from "react";
import { useHistory } from "react-router-dom/";
import { updateReservationData } from "../utils/api";
import "./ReservationNew.css";
import { useParams, useLocation } from "react-router-dom";
import Form from "./Form";

function EditReservation() {
  const history = useHistory();
  const [reservationsError, setReservationsError] = useState(null);
  const location = useLocation();
  const uParam = useParams();
  const goToReservation = (reservation_date) => {
    history.push(`/dashboard?date=${reservation_date}`);
  };

  const initialFormState = {
    first_name: location.state.first_name,
    last_name: location.state.last_name,
    mobile_number: location.state.mobile_number,
    reservation_date: location.state.reservation_date,
    reservation_time: location.state.reservation_time,
    people: location.state.people,
    status: location.state.status,
    reservation_id: uParam.reservation_id,
  };

  const [formData, setFormData] = useState({ ...initialFormState });

  const handleSubmit = async (data) => {
    const abortController = new AbortController();
    try {
      const resp = await updateReservationData(
        uParam.reservation_id,
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
      <h1>Edit Reservation</h1>
      <Form
        data={formData}
        error={reservationsError}
        onFormSubmit={handleSubmit}
      ></Form>
    </div>
  );
}

export default EditReservation;
