const express = require("express");
const { getAdmins } = require("../../handlers/admin/adminControl");
const router = express.Router();

router.route("/").get(getAdmins);

module.exports = router;
