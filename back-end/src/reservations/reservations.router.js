const router = require("express").Router();
const controller = require("./reservations.controller");
router
  .route("/:reservation_id")
  .put(controller.update)
  .get(controller.getReservation);
router.route("/:reservation_id/status").put(controller.updateStatus);
router.route("/").get(controller.list).post(controller.create);

module.exports = router;
