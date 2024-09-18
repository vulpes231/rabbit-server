const express = require("express");
const {
  getAllOrders,
  completeOrder,
  getOrder,
} = require("../../handlers/admin/orderAccess");

const router = express.Router();

router.route("/").get(getAllOrders);
router.route("/:orderId").get(getOrder).post(completeOrder);

module.exports = router;
