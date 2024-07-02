const express = require("express");
const {
  changePassword,
  getUser,
} = require("../../handlers/user/userController");

const router = express.Router();

router.route("/").get(getUser).put(changePassword);

module.exports = router;
