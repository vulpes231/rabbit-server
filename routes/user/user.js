const express = require("express");
const { changePassword } = require("../../handlers/user/userController");

const router = express.Router();

router.route("/").put(changePassword);

module.exports = router;
