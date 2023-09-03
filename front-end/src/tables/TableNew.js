import { React, useState } from "react";
import { useHistory } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { createTable } from "../utils/api";
import Alert from "@mui/material/Alert";
import resimage from "./../images/my-res.jpeg";
function TableNew() {
  const history = useHistory();
  const [addTableError, setAddTableError] = useState(null);
  const initialFormState = {
    table_name: "",
    capacity: "",
  };
  const [formData, setFormData] = useState({ ...initialFormState });
  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };
  const goToDashboard = () => {
    history.push(`/dashboard`);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    // const response = await TableNew(formData);
    formData.capacity = parseInt(formData.capacity);
    createTable({ data: formData })
      .then((resp) => {
        goToDashboard();
      })
      .catch((err) => {
        setAddTableError(err.message);
      });
    history.push(`/dashboard`);
  };
  const goBack = () => {
    history.goBack();
  };
  return (
    <div>
      <h1>Add New Table</h1>
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
        <form
          onSubmit={handleSubmit}
          style={{ width: "-webkit-fill-available" }}
        >
          <Stack spacing={2} direction="column" sx={{ marginBottom: 4 }}>
            <TextField
              type="text"
              variant="outlined"
              color="secondary"
              label="Table Name"
              name="table_name"
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              id="people"
              label="Capacity"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              variant="standard"
              onChange={handleChange}
              min="1"
              name="capacity"
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
          {addTableError && <Alert severity="error">{addTableError}</Alert>}
        </form>
        <img src={resimage} alt="logo" />
      </Stack>
    </div>
  );
}

export default TableNew;
