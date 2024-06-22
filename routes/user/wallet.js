const express = require("express");
const {
  getUserBalance,
  deposit,
  confirmTransaction,
} = require("../../handlers/user/walletController");

const router = express.Router();

router.route("/balance").get(getUserBalance);
router.route("/deposit").post(deposit);
router.route("/:transactionId").put(confirmTransaction);
module.exports = router;
