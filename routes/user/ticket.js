const express = require("express");
const { createNewTicket } = require("../../handlers/user/ticketController");

const router = express.Router();
router.route("/").post(createNewTicket);

module.exports = router;
