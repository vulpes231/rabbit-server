const express = require("express");
const { updateTicketStatus } = require("../../handlers/admin/ticketControl");

const router = express.Router();
router.route("/").post(updateTicketStatus);

module.exports = router;
