const { default: mongoose } = require("mongoose");
const Schema = mongoose.Schema;
const Ticket = require("./Ticket"); // Import Ticket model

const messageSchema = new Schema({
  from: {
    type: String,
    required: true,
  },
  msg: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  chatId: {
    type: Schema.Types.ObjectId,
    ref: "Ticket",
    required: true,
  },
});

// Send a new message
messageSchema.statics.sendMessage = async function (from, msg, chatId) {
  const message = new this({ from, msg, chatId });
  await message.save();
  // Update the ticket with the new message reference
  await Ticket.findByIdAndUpdate(chatId, {
    $push: { messages: message._id },
  });
  return message;
};

// Get messages by ticket ID
messageSchema.statics.getMessagesByTicketId = async function (ticketId) {
  // console.log(ticketId);
  return await this.find({ chatId: ticketId }).populate().sort({ date: 1 });
};

// Delete messages by ticket ID
messageSchema.statics.deleteMessagesByTicketId = async function (ticketId) {
  return await this.deleteMany({ chatId: ticketId });
};

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
