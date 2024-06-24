const express = require("express");
const {
  getUserBalance,
  deposit,
} = require("../../handlers/user/walletController");

const router = express.Router();

router.route("/balance").get(getUserBalance);
router.route("/deposit").post(deposit);

module.exports = router;
