const express = require("express");
const { signinUser } = require("../../handlers/user/signinController");

const router = express.Router();

router.route("/").post(signinUser);

module.exports = router;
