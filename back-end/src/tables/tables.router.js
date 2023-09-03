const router = require("express").Router();
const controller = require("./tables.controller");
router.route("/:table_id/seat").put(controller.reserveTable).delete(controller.remove);
router.route("/").get(controller.list).post(controller.create);

module.exports = router;
