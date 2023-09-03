const { query } = require("express");
const service = require("./tables.service");
const hasProperties = require("../errors/hasProperties");
const hasRequiredProperties = hasProperties("table_name", "capacity");
const hasRequiredSeatedProperties = hasProperties("reservation_id");
const moment = require("moment");

function create(req, res, next) {
  service
    .create(req.body.data)
    .then((data) => res.status(201).json({ data }))
    .catch(next);
}
async function list(req, res, next) {
  const response = await service.list();
  return res.json({ data: response });
}
async function validateTableReservation(req, res, next) {
  const ppl = await service.getPeople(req.body.data.reservation_id);
  if (!ppl) {
    return next({
      status: 404,
      message: `Reservation ${req.body.data.reservation_id} does not exist`,
    });
  }
  const resp = await service.reservationStatusById(
    req.body.data.reservation_id
  );
  if (resp.status === "seated") {
    return next({
      status: 400,
      message: `Reservation already ${resp.status}`,
    });
  }
  const capacity = await service.getCapacity(req.params.table_id);
  const isOccupied = await service.isOccupied(req.params.table_id);
  if (ppl["people"] > capacity["capacity"]) {
    return next({
      status: 400,
      message: `capacity`,
    });
  } else if (isOccupied.status) {
    return next({
      status: 400,
      message: `Table is occupied`,
    });
  }
  next();
}
async function isNotOccupied(req, res, next) {
  const isOccupied = await service.isOccupied(req.params.table_id);
  if (!isOccupied.status) {
    return next({
      status: 400,
      message: `Table is not occupied`,
    });
  }
  next();
}
async function tableExists(req, res, next) {
  const table_id = req.params.table_id;
  let response;
  response = await service.tableById(table_id);
  if (response.length === 0) {
    return next({
      status: 404,
      message: `${table_id}`,
    });
  }
  return next();
}
async function reserveTable(req, res, next) {
  const response = await service.update(
    req.body.data.reservation_id,
    req.params.table_id
  );
  return res.json({ data: response });
}
async function freeTable(req, res, next) {
  const response = await service.remove(req.params.table_id);
  return res.json({ data: response });
}
function checkCapacity(req, res, next) {
  const { data = {} } = req.body;
  if (typeof data.capacity != "number") {
    return next({
      status: 400,
      message: `Invalid capacity`,
    });
  }
  return next();
}
function checkTableName(req, res, next) {
  const { data = {} } = req.body;
  if (data.table_name.length < 2) {
    return next({
      status: 400,
      message: `Invalid table_name`,
    });
  }
  return next();
}
module.exports = {
  create: [hasRequiredProperties, checkCapacity, checkTableName, create],
  list,
  reserveTable: [
    hasRequiredSeatedProperties,
    validateTableReservation,
    reserveTable,
  ],
  remove: [tableExists, isNotOccupied, freeTable],
};
