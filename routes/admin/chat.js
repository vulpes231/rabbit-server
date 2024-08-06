const express = require("express");
const { adminSendMessage } = require("../../handlers/admin/chatControl");

const router = express.Router();

router.route("/").post(adminSendMessage);

module.exports = router;
