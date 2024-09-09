const express = require("express");
const { getUser, editUser } = require("../../handlers/user/userController");

const router = express.Router();

router.route("/").get(getUser).put(editUser);

module.exports = router;
