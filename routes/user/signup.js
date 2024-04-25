const express = require("express");
const { signupUser } = require("../../handlers/user/signupController");

const router = express.Router();

router.route("/").post(signupUser);

module.exports = router;
