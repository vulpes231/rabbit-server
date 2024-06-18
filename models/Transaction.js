const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  amount: {
    type: Number,
  },
  method: {
    type: String,
  },
  status: {
    default: "pending",
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);
