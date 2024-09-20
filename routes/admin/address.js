const express = require("express");
const {
  generateWalletAddress,
  createCoinWallet,
  getWallets,
} = require("../../handlers/user/addressControl");

const router = express.Router();

router.route("/").get(getWallets).post(createCoinWallet);
router.route("/generate").get(generateWalletAddress);

module.exports = router;
