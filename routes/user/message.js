const express = require("express");
const {
  getMessagesByTicketId,
  userSendMessage,
} = require("../../handlers/user/userMessageHandler");

const router = express.Router();

router.route("/:chatId").get(getMessagesByTicketId);
router.route("/").post(userSendMessage);

module.exports = router;
