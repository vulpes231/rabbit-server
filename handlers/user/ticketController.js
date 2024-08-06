const Ticket = require("../../models/Ticket");

const createNewTicket = async (req, res) => {
  const { orderId } = req.body;

  try {
    const ticket = await Ticket.createTicket(orderId);
    res.status(201).json({ message: "Ticket created successfully", ticket });
  } catch (error) {
    res.status(500).json({ message: error.message }); // Return the error message
  }
};

module.exports = { createNewTicket };
