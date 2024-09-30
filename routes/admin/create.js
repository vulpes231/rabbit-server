const express = require("express");
const { createAdmin } = require("../../handlers/admin/adminSignup");
const router = express.Router();

router.route("/").post(createAdmin);

module.exports = router;
