const express = require("express");
const {
  getUserTransactions,
  getAllTrnx,
} = require("../../handlers/user/transationController");

const router = express.Router();

router.route("/:userId").get(getUserTransactions);
router.route("/").get(getAllTrnx);

module.exports = router;
