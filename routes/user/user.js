const express = require("express");
const {
  getAllUsers,
  changePassword,
} = require("../../handlers/user/userController");

const router = express.Router();

router.route("/").get(getAllUsers).put(changePassword);

module.exports = router;
