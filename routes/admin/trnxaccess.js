const express = require("express");
const {
  getAllTrnx,
  completeTransaction,
} = require("../../handlers/admin/trnxAccess");

const router = express.Router();

router.route("/").get(getAllTrnx).put(completeTransaction);

module.exports = router;
