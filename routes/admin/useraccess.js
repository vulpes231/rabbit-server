const express = require("express");
const { getAllUsers } = require("../../handlers/admin/userAccess");

const router = express.Router();

router.route("/").get(getAllUsers);

module.exports = router;
