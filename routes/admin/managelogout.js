const express = require("express");
const { logoutAdmin } = require("../../handlers/admin/logoutControl");

const router = express.Router();

router.route("/").put(logoutAdmin);

module.exports = router;
