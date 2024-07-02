const express = require("express");
const {
  confirmTransaction,
  getAllWallets,
} = require("../../handlers/admin/walletAccess");

const router = express.Router();

router.route("/").get(getAllWallets);
router.route("/").put(confirmTransaction);

module.exports = router;
