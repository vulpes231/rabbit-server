const express = require("express");
const { getBalance, deposit } = require("../../handlers/user/walletController");

const router = express.Router();

router.route("/").get(getBalance).post(deposit);

module.exports = router;
