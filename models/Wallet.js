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

//static method to deposit funds manually
walletSchema.statics.depositManual = async function (userId, depositData) {
  const Address = require("./Address");
  const Transaction = require("./Transaction");
  const User = require("./User");
  const Wallet = require("./Wallet");

  const { coinName, network, amount } = depositData;

  try {
    // Check for the user
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found!");
    }

    // Check for the user's wallet
    const userWallet = await Wallet.findOne({ owner: user._id });
    if (!userWallet) {
      // Fix the condition to check userWallet
      throw new Error("User wallet not found!");
    }

    // Get the deposit address
    const coinData = { coinName, network };
    const getAddress = await Address.getCoinAddress(coinData);

    console.log(getAddress.address);

    // Create the transaction if deposit address exists
    let transactionData;
    if (getAddress) {
      transactionData = await Transaction.createTransaction({
        creator: user._id,
        currency: coinName,
        network: network,
        amount: amount,
        depositAddress: getAddress.address,
        userEmail: user.email,
      });
    }

    return transactionData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Static method to deposit funds automatically into wallet
walletSchema.statics.depositAuto = async function (userId, transactionData) {
  const Transaction = require("./Transaction");
  try {
    const wallet = await this.findOne({ owner: userId });

    if (!wallet) {
      throw new Error("Wallet not found!");
    }

    const transaction = await Transaction.createTransaction(transactionData);

    return transaction;
  } catch (error) {
    throw error;
  }
};

walletSchema.statics.confirmTransaction = async function (updateData) {
  const session = await mongoose.startSession();
  session.startTransaction();
  const Transaction = require("./Transaction");

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
