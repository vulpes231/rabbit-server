const express = require("express");
const { getAllUsers } = require("../../handlers/user/userController");

const router = express.Router();

router.route("/").get(getAllUsers);

module.exports = router;
