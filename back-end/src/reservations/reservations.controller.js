const { query } = require("express");
const service = require("./reservations.service");
const hasProperties = require("../errors/hasProperties");
const hasRequiredProperties = hasProperties(
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
);
const moment = require("moment");
function checkPeople(req, res, next) {
  const { data = {} } = req.body;
  if (typeof data.people != "number") {
    return next({
      status: 400,
      message: `Invalid people`,
    });
  }
  return next();
}
function checkStatus(req, res, next) {
  const { data = {} } = req.body;
  if (data.status && data.status != "booked") {
    return next({
      status: 400,
      message: `Invalid status ${data.status}`,
    });
  }
  return next();
}
function checkValidStatuses(req, res, next) {
  const { data = {} } = req.body;
  if (!["cancelled", "booked", "seated", "finished"].includes(data.status)) {
    return next({
      status: 400,
      message: `Invalid status ${data.status}`,
    });
  }
  return next();
}
function reservationDateCheck(req, res, next) {
  const { data = {} } = req.body;
  if (!moment(data.reservation_date).isValid()) {
    return next({
      status: 400,
      message: `reservation_date`,
    });
  }
  const day = moment(data.reservation_date).format("dddd");
  const time = moment(data.reservation_time, "HH:mm:ss");
  const date = moment(data.reservation_date);
  date.set({
    hour: time.get("hour"),
    minute: time.get("minute"),
    second: time.get("second"),
  });
  const diff = date.diff(moment());
  const startTime = moment("10:29:59", "HH:mm:ss");
  const endTime = moment("21:31:00", "HH:mm:ss");
  if (diff <= 0) {
    return next({
      status: 400,
      message: `Reservations available only for future dates`,
    });
  } else if (day.toLowerCase() === "Tuesday".toLocaleLowerCase()) {
    return next({
      status: 400,
      message: `Restaurant closed on Tuesday`,
    });
  } else if (!time.isBetween(startTime, endTime)) {
    return next({
      status: 400,
      message: `Invalid reservation_time`,
    });
  }
  return next();
}
async function list(req, res, next) {
  const date = req.query?.date;
  const mobile_number = req.query?.mobile_number;
  let response;
  if (date) {
    response = await service.listByDate(date);
  } else if (mobile_number) {
    response = await service.listByMobileNumber(mobile_number);
  } else {
    response = await service.list();
  }
  // if (response.length === 0) {
  //   return next({
  //     status: 400,
  //     message: `No reservations found`,
  //   });
  // }
  return res.json({ data: response });
}
async function reservationExists(req, res, next) {
  const reservation_id = req.params.reservation_id;
  let response;
  response = await service.reservationById(reservation_id);
  if (response.length === 0) {
    return next({
      status: 404,
      message: `Reservation ${reservation_id} does not exist`,
    });
  }
  return next();
}
async function checkIfStatusFinal(req, res, next) {
  const reservation_id = req.params.reservation_id;
  let response;
  response = await service.reservationById(reservation_id);
  if (response.length === 0) {
    return next({
      status: 404,
      message: `Reservation ${reservation_id} does not exist`,
    });
  } else if (response[0]["status"].toLowerCase() === "finished") {
    return next({
      status: 400,
      message: `Reservation status is ${response[0]["status"]}`,
    });
  }
  return next();
}
async function getReservation(req, res, next) {
  const reservation_id = req.params.reservation_id;
  let response;
  response = await service.reservationById(reservation_id);
  if (response.length === 0) {
    return next({
      status: 404,
      message: `Reservation ${reservation_id} does not exist`,
    });
  }
  const data = response[0];
  return res.status(200).json({ data });
}
function create(req, res, next) {
  service
    .create(req.body.data)
    .then((data) => res.status(201).json({ data }))
    .catch(next);
}

function update(req, res, next) {
  service
    .update(req.params.reservation_id, req.body.data)
    .then((resp) => {
      const data = resp[0];
      res.status(200).json({ data });
    })
    .catch(next);
}

function updateStatus(req, res, next) {
  service
    .updateStatus(req.params.reservation_id, req.body.data)
    .then((resp) => {
      const data = resp[0];
      res.status(200).json({ data });
    })
    .catch(next);
}

module.exports = {
  list,
  create: [
    hasRequiredProperties,
    reservationDateCheck,
    checkPeople,
    checkStatus,
    create,
  ],
  update: [
    reservationExists,
    hasRequiredProperties,
    reservationDateCheck,
    checkPeople,
    update,
  ],
  updateStatus: [
    reservationExists,
    checkValidStatuses,
    checkIfStatusFinal,
    updateStatus,
  ],
  getReservation,
};
