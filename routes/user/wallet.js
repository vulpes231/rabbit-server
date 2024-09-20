const express = require("express");
const {
  getUserBalance,
  depositAuto,
  depositManually,
} = require("../../handlers/user/walletController");

const router = express.Router();

router.route("/balance").get(getUserBalance);
router.route("/depositauto").post(depositAuto);
router.route("/depositmanual").post(depositManually);

module.exports = router;
