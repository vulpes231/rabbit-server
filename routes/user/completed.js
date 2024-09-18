const express = require("express");
const {
  getUserCompletedOrders,
} = require("../../handlers/user/completedControl");

const router = express.Router();

router.route("/").get(getUserCompletedOrders);

module.exports = router;
