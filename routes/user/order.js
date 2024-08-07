const express = require("express");
const {
  getUserOrders,
  createOrder,
  getOrderById,
} = require("../../handlers/user/orderController");

const router = express.Router();

router.route("/").get(getUserOrders).post(createOrder);
router.route("/:orderId").get(getOrderById);
module.exports = router;
