const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const walletSchema = new Schema({
  balance: {
    type: Number,
    default: 0,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// Static method to get wallet balance
walletSchema.statics.getBalance = async function (userId) {
  try {
    const wallet = await this.findOne({ owner: userId });
    if (!wallet) {
      throw new Error("Wallet not found!");
    }
    return wallet.balance;
  } catch (error) {
    throw error;
  }
};

// Static method to deposit funds into wallet
walletSchema.statics.deposit = async function (userId, transactionData) {
  try {
    const wallet = await this.findOne({ owner: userId });

    if (!wallet) {
      throw new Error("Wallet not found!");
    }

    const Transaction = require("./Transaction");
    const transaction = await Transaction.createTransaction(transactionData);

    return transaction; // Return the created transaction object
  } catch (error) {
    throw error;
  }
};

// Static method to confirm a transaction
walletSchema.statics.confirmTransaction = async function (transactionId) {
  try {
    // Fetch the transaction details (assuming you have a Transaction model)
    const Transaction = require("./Transaction");

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      throw new Error("Transaction not found!");
    }

    const userWallet = await this.findOne({ owner: transaction.creator });

    // Increase the balance of the creator of the transaction
    const wallet = await this.findByIdAndUpdate(
      userWallet._id,
      { $inc: { balance: transaction.amount } },
      { new: true }
    );

    if (!wallet) {
      throw new Error("Wallet of transaction creator not found!");
    }

    // Optionally, you can update the status of the transaction to 'completed'
    transaction.status = "completed";
    await transaction.save();

    return wallet;
  } catch (error) {
    throw error;
  }
};

module.exports = mongoose.model("Wallet", walletSchema);
