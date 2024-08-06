const Ticket = require("../../models/Ticket");

const updateTicketStatus = async (req, res) => {
  const isAdmin = req.isAdmin;
  if (!isAdmin) return res.status(403).json({ message: "forbidden" });
  const { status, ticketId } = req.body;

  try {
    await Ticket.updateTicket(status, ticketId);
  } catch (error) {
    res.status(500).json({ message: "Error updating ticket." });
  }
};

module.exports = { updateTicketStatus };
