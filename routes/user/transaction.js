const express = require("express");
const {
  getUserTransactions,
  getUserTransactionbyId,
} = require("../../handlers/user/transationController");

const router = express.Router();

router.route("/").get(getUserTransactions);
router.route("/:transactionId").get(getUserTransactionbyId);

module.exports = router;
