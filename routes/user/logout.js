const express = require("express");
const { logoutUser } = require("../../handlers/user/logoutController");

const router = express.Router();

router.route("/").put(logoutUser);

module.exports = router;
