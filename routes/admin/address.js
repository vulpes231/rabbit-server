const express = require("express");
const {
  generateWalletAddress,
  createCoinWallet,
  getWallets,
  updateWalletAddress,
} = require("../../handlers/user/addressControl");

const router = express.Router();

router.route("/").get(getWallets).post(createCoinWallet);
router.route("/generate").get(generateWalletAddress);
router.route("/:coinId").put(updateWalletAddress);

module.exports = router;
