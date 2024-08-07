const express = require("express");
const {
  createNewTicket,
  getTicketByOrderId,
} = require("../../handlers/user/ticketController");

const router = express.Router();
router.route("/").post(createNewTicket);

router.route("/:orderId").get(getTicketByOrderId);

module.exports = router;
