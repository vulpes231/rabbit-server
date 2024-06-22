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
    type: String,
    default: "pending", // Default status is set to "pending"
  },
});

// Static method to create a new transaction
transactionSchema.statics.createTransaction = async function (transactionData) {
  try {
    const newTransaction = new this(transactionData);
    await newTransaction.save();
    return newTransaction;
  } catch (error) {
    throw error;
  }
};

// // Static method to confirm a transaction (change status to "completed")
// transactionSchema.statics.confirmTransaction = async function (transactionId) {
//   try {
//     const transaction = await this.findByIdAndUpdate(
//       transactionId,
//       { status: "completed" },
//       { new: true }
//     );

//     if (!transaction) {
//       throw new Error("Transaction not found!");
//     }

//     return transaction;
//   } catch (error) {
//     throw error;
//   }
// };

// Static method to get all transactions of a user
transactionSchema.statics.getUserTransactions = async function (userId) {
  try {
    const transactions = await this.find({ creator: userId });
    return transactions;
  } catch (error) {
    throw error;
  }
};

transactionSchema.statics.getTransactions = function () {
  return this.find();
};

module.exports = mongoose.model("Transaction", transactionSchema);
