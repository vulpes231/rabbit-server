const express = require("express");
const {
  getUserOrders,
  createOrder,
  completeOrder,
  getAllOrders,
} = require("../../handlers/user/orderController");

const router = express.Router();

router.route("/").get(getUserOrders).post(createOrder).put(completeOrder);
router.route("/all").get(getAllOrders);
module.exports = router;
