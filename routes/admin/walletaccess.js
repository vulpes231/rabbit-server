const express = require("express");
const {
  getAllWallets,
  suspendWallet,
  unsuspendWallet,
} = require("../../handlers/admin/walletAccess");

const router = express.Router();

router.route("/").get(getAllWallets);
router.route("/:walletId").post(suspendWallet).put(unsuspendWallet);

module.exports = router;
