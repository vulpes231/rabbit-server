const Message = require("../../models/Message");
const User = require("../../models/User");

const userSendMessage = async (req, res) => {
  const userId = req.userId;

  const { msg, chatId } = req.body;
  // console.log(req.body);

  try {
    const user = await User.findOne({ _id: userId });

    await Message.sendMessage(user.username, msg, chatId);
  } catch (error) {
    res.status(500).json({ message: "Error sending message" });
  }
};

const getMessagesByTicketId = async (req, res) => {
  const { ticketId } = req.params;
  try {
    const messages = await Message.getMessagesByTicketId(ticketId);
    return res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ message: "Error fetching message" });
  }
};

module.exports = { userSendMessage, getMessagesByTicketId };
