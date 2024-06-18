const express = require("express");
const {
  getUserTransactions,
} = require("../../handlers/user/transationController");

const router = express.Router();

router.route("/").get(getUserTransactions);

module.exports = router;
