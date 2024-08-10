const Ticket = require("../../models/Ticket");

const createNewTicket = async (req, res) => {
  const { orderId } = req.body;
  // console.log("id", orderId);

  try {
    const ticket = await Ticket.createTicket(orderId);
    res.status(201).json({ message: "Ticket created successfully", ticket });
  } catch (error) {
    res.status(500).json({ message: error.message }); // Return the error message
  }
};

const getTicketByOrderId = async (req, res) => {
  const { orderId } = req.params;
  try {
    const ticket = await Ticket.getTicketByOrderId(orderId);
    res.status(201).json({ ticket });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createNewTicket, getTicketByOrderId };
