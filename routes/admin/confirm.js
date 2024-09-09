const express = require("express");
const { confirmTransaction } = require("../../handlers/admin/walletAccess");

const router = express.Router();

router.route("/").put(confirmTransaction);

module.exports = router;
