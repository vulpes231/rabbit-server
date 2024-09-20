const express = require("express");
const {
  getUserTransactions,
  getUserTransactionbyId,
  confirmPayment,
} = require("../../handlers/user/transationController");

const router = express.Router();

router.route("/").get(getUserTransactions);
router
  .route("/:transactionId")
  .get(getUserTransactionbyId)
  .post(confirmPayment);

module.exports = router;
