const express = require("express");
const {
  updateTicketStatus,
  getAllTickets,
} = require("../../handlers/admin/ticketControl");

const router = express.Router();
router.route("/").get(getAllTickets).post(updateTicketStatus);

module.exports = router;
