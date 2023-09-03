const knex = require("../db/connection");

function create(table) {
  return knex("tables")
    .insert(table)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}
function list() {
  // return knex("tables").select("*").orderBy("table_name");
  return knex
    .select(
      "t.table_name",
      "t.table_id",
      "t.capacity",
      knex.raw(
        "case when r.reservation_id is null then 'Free' else 'Occupied' end status"
      )
    )
    .from("tables as t")
    .leftOuterJoin("reservations as r", "t.table_id", "r.table_id")
    .orderBy("table_name");
}
function tableById(table_id) {
  return knex("tables").select("*").where({ table_id: table_id });
}
function update(reservation_id, table_id) {
  return knex("reservations")
    .where({ reservation_id: reservation_id })
    .update({ table_id: table_id, status: "seated" })
    .select("*");
}
// select people from reservations r where r.reservation_id =8;
function getPeople(reservation_id) {
  return knex
    .select("r.people")
    .from("reservations as r")
    .where({ reservation_id: reservation_id })
    .first();
}
// select capacity from "tables" t where t.table_id =1;
function getCapacity(table_id) {
  return knex
    .select("capacity")
    .from("tables as t")
    .where({ table_id: table_id })
    .first();
}
function isOccupied(table_id) {
  return knex
    .select(knex.raw("case when count(*)=0 then false else true end status"))
    .from("reservations as r")
    .where({ table_id: table_id })
    .first();
}
function reservationStatusById(reservation_id) {
  return knex
    .select("status")
    .from("reservations as t")
    .where({ reservation_id: reservation_id })
    .first();
}
function remove(table_id) {
  return knex("reservations")
    .where({ table_id: table_id })
    .update({ table_id: null, status: "finished" })
    .select("*");
}
module.exports = {
  create,
  list,
  update,
  getPeople,
  getCapacity,
  isOccupied,
  remove,
  tableById,
  reservationStatusById,
};
