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

walletSchema.statics.getAllWallets = function () {
  return this.find();
};

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

const Transaction = require("./Transaction");

// Static method to deposit funds into wallet
walletSchema.statics.deposit = async function (userId, transactionData) {
  try {
    const wallet = await this.findOne({ owner: userId });

    if (!wallet) {
      throw new Error("Wallet not found!");
    }

    const transaction = await Transaction.createTransaction(transactionData);

    return transaction; // Return the created transaction object
  } catch (error) {
    throw error;
  }
};

walletSchema.statics.confirmTransaction = async function (updateData) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Fetch the transaction details
    const transaction = await Transaction.findById(
      updateData.transactionId
    ).session(session);
    if (!transaction) {
      throw new Error("Transaction not found!");
    }

    // Find the wallet associated with the transaction creator
    const wallet = await this.findOne({ owner: transaction.creator }).session(
      session
    );
    if (!wallet) {
      throw new Error("Wallet of transaction creator not found!");
    }

    if (updateData.paid) {
      // Increase the balance of the wallet
      wallet.balance += updateData.amount;
      await wallet.save({ session });

      // Update the transaction status
      transaction.status = "completed";
      await transaction.save({ session });
    } else {
      // Handle other status updates if necessary
      transaction.status = updateData.status;
      await transaction.save({ session });
    }

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return wallet;
  } catch (error) {
    // Rollback the transaction if any error occurs
    await session.abortTransaction();
    session.endSession();

    throw error;
  }
};

const Wallet = mongoose.model("Wallet", walletSchema);
module.exports = Wallet;
