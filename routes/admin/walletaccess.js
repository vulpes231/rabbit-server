const express = require("express");
const { getAllWallets } = require("../../handlers/admin/walletAccess");

const router = express.Router();

router.route("/").get(getAllWallets);

module.exports = router;
