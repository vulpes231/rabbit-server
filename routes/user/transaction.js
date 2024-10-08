const express = require("express");
const {
  getUserTransactions,
  getUserTransactionbyId,
  markTrnxPaid,
} = require("../../handlers/user/transationController");

const router = express.Router();

router.route("/").get(getUserTransactions);
router.route("/:transactionId").get(getUserTransactionbyId).post(markTrnxPaid);

module.exports = router;
