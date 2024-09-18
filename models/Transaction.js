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
  currency: {
    type: String,
  },
  network: {
    type: String,
  },
  status: {
    type: String,
    default: "pending",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

transactionSchema.statics.createTransaction = async function (transactionData) {
  try {
    const newTransaction = new this(transactionData);
    await newTransaction.save();
    return newTransaction;
  } catch (error) {
    throw error;
  }
};

transactionSchema.statics.confirmTransaction = async function (transactionId) {
  const session = await mongoose.startSession();
  session.startTransaction();
  const Wallet = require("./Wallet");
  try {
    const transaction = await Transaction.findById(transactionId).session(
      session
    );
    if (!transaction) {
      throw new Error("Transaction not found!");
    }

    const userWallet = await Wallet.findOne({
      owner: transaction.creator,
    }).session(session);
    if (!userWallet) {
      throw new Error("User wallet not found!");
    }

    userWallet.balance += transaction.amount;

    await userWallet.save({ session });

    transaction.status = "completed";
    await transaction.save({ session });

    await session.commitTransaction();

    return transaction;
  } catch (error) {
    await session.abortTransaction();
    console.error("Error confirming transaction:", error);
    throw new Error(
      "Failed to confirm the transaction. Please try again later."
    );
  } finally {
    session.endSession();
  }
};

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

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
