const Message = require("../../models/Message");
const Admin = require("../../models/Admin");

const adminSendMessage = async (req, res) => {
  const isAdmin = req.isAdmin;
  const adminId = req.adminId;

  if (!isAdmin) return res.status(403).json({ message: "Forbidden" });

  const { msg, chatId } = req.body;

  try {
    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const message = await Message.sendMessage(admin.username, msg, chatId);

    res
      .status(201)
      .json({ message: "Message sent successfully", data: message });
  } catch (error) {
    console.error(error); // Logging the error for debugging
    res.status(500).json({ message: "Error sending message" });
  }
};

module.exports = { adminSendMessage };
