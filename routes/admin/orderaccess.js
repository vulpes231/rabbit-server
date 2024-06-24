const express = require("express");
const {
  getAllOrders,
  completeOrder,
} = require("../../handlers/admin/orderAccess");

const router = express.Router();

router.route("/").get(getAllOrders).put(completeOrder);

module.exports = router;
