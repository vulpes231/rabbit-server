const { default: mongoose } = require("mongoose");
const Schema = mongoose.Schema;

const ticketSchema = new Schema({
  createdBy: {
    type: String,
  },
  status: {
    type: String,
    default: "open",
  },
  orderId: {
    type: String,
  },
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
});

const Order = require("./Order");
const User = require("./User");

// Create a new ticket
ticketSchema.statics.createTicket = async function (orderId) {
  try {
    // Find the order by ID
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found!");

    const ticket = await Ticket.findOne({ orderId: order._id });
    if (ticket) throw new Error("Ticket already exist!");

    const creator = await User.findOne({ _id: order.creator });

    // Create and save a new Ticket instance
    const newTicket = new this({
      createdBy: order.creator,
      user: creator.username,
      orderId: order._id,
    });

    return await newTicket.save(); // Return the saved ticket
  } catch (error) {
    throw new Error(error.message); // Provide more informative error messages
  }
};

// Update ticket status
ticketSchema.statics.updateTicket = async function (status, ticketId) {
  return await this.findByIdAndUpdate(ticketId, status, {
    new: true,
  });
};

// Delete a ticket
ticketSchema.statics.deleteTicket = async function (ticketId) {
  // Delete associated messages first
  await Message.deleteMany({ chatId: ticketId });
  return await this.findByIdAndDelete(ticketId);
};

ticketSchema.statics.getTicketByOrderId = async function (orderId) {
  try {
    const ticket = await Ticket.findOne({ orderId: orderId });
    if (!ticket) {
      throw new Error(`Ticket with orderId ${orderId} not found.`);
    }
    return ticket;
  } catch (error) {
    console.error(error);
    throw new Error(`Error retrieving ticket: ${error.message}`);
  }
};

const Ticket = mongoose.model("Ticket", ticketSchema);
module.exports = Ticket;
