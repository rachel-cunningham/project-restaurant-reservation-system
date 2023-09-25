import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { freeSeat, listTables } from "../utils/api";
import "./Tables.css";

export default function Tables() {
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [tableId, setTableId] = React.useState(null);
  const [cancelError, setCancelError] = useState(null);
  function loadTables() {
    const abortController = new AbortController();
    setTablesError(null);
    listTables()
      .then((resp) => {
        setTables(resp);
        setTablesError(null);
      })
      .catch((err) => {
        setTables(null);
        setTablesError(err.message);
      });

    return () => abortController.abort();
  }
  useEffect(() => {
    loadTables();
  }, []);
  const handleClose = () => {
    setOpen(false);
  };
  const openDialog = (table_id) => async () => {
    setOpen(true);
    setTableId(table_id);
  };
  async function finishReservation() {
    try {
      const res = await freeSeat(tableId);
      console.log(res);
      setOpen(false);
      loadTables();
    } catch (err) {
      setCancelError(err?.message);
    }

    setOpen(false);
  }
  return (
    <div>
      {tablesError}
      <div>
        {Array.isArray(tables) &&
          tables.length > 0 &&
          tables.map((table) => (
            <div className="card" id={table.table_id}>
              <div className="table-wrap">
                <div>
                  <div className="t-name name">
                    Table #{table.table_id} - {table.table_name}
                  </div>
                  <div className="name">Seats: {table.capacity}</div>
                  <div className="name" data-table-id-status={table.table_id}>
                    Currently: {table.status}
                  </div>
                </div>
                <div className="finish-button">
                  {table.status.toLowerCase() === "occupied" && (
                    <Button
                      variant="contained"
                      onClick={openDialog(table.table_id)}
                      data-table-id-finish={table.table_id}
                    >
                      Finish
                    </Button>
                  )}
                </div>
              </div>
              {cancelError && <Alert severity="error">{cancelError}</Alert>}
            </div>
          ))}
      </div>
      <Dialog
        id="table-finish-alert"
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Is this table ready to seat new guests? This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            data-table-cancel-selector="table-cancel"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            data-table-ok-selector="table-ok"
            onClick={finishReservation}
            autoFocus
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
