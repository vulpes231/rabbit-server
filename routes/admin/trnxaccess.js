const express = require("express");
const { getAllTrnx } = require("../../handlers/admin/trnxAccess");

const router = express.Router();

router.route("/").get(getAllTrnx);

module.exports = router;
