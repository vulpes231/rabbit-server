const express = require("express");
const {
  getUserOrders,
  createOrder,
} = require("../../handlers/user/orderController");

const router = express.Router();

router.route("/").get(getUserOrders).post(createOrder);
module.exports = router;
