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
  ownerEmail: {
    type: String,
  },
  suspended: {
    type: Boolean,
    default: false,
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

walletSchema.statics.depositAuto = async function (userId, depositData) {
  const Transaction = require("./Transaction");
  const User = require("./User");
  const axios = require("axios");

  const { coinName, network, amount } = depositData;

  try {
    // Check for the user
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found!");
    }

    const userWallet = await Wallet.findById(user._id);

    if (userWallet.suspended) {
      throw new Error("wallet banned! contact admin");
    }

    const transactionData = await Transaction.createTransaction({
      creator: user._id,
      currency: coinName,
      network: network,
      amount: amount,
      depositAddress: "auto",
      userEmail: user.email,
    });

    const serverUrl = process.env.SERVER_URL;
    const apiKey = process.env.PLISIO_API_KEY;

    const invoiceData = {
      source_currency: "USD",
      source_amount: amount,
      order_number: transactionData._id,
      currency:
        coinName === "bitcoin"
          ? "BTC"
          : coinName === "ethereum"
          ? "ETH"
          : coinName === "tether"
          ? "USDT"
          : coinName,
      email: user.email,
      order_name: `${coinName}-${user.username}`,
      callback_url: `${serverUrl}/callback/?json=true`,
      api_key: apiKey,
    };

    const params = new URLSearchParams(invoiceData);
    const url = `https://api.plisio.net/api/v1/invoices/new?${params.toString()}`;

    const createInvoice = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return createInvoice.data;
  } catch (error) {
    console.error("Error in depositAuto:", error);
    throw error; // Optionally, you could customize the error further
  }
};

walletSchema.statics.confirmTransaction = async function (orderData) {
  const Transaction = require("./Transaction");
  const session = await Transaction.startSession();
  session.startTransaction();
  const crypto = require("crypto");

  try {
    const {
      txn_id,
      ipn_type,
      merchant,
      merchant_id,
      amount,
      currency,
      order_number,
      order_name,
      confirmations,
      status,
      verify_hash,
      source_currency,
      source_amount,
      source_rate,
      comment,
      invoice_commission,
      invoice_sum,
      invoice_total_sum,
    } = orderData;

    // Verify the hash
    const secretKey = process.env.PLISIO_API_KEY;
    const hashData = `${txn_id}${ipn_type}${merchant}${merchant_id}${amount}${currency}${order_number}${order_name}${confirmations}${status}${source_currency}${source_amount}${source_rate}${comment}${invoice_commission}${invoice_sum}${invoice_total_sum}`;
    const expectedHash = crypto
      .createHmac("sha256", secretKey)
      .update(hashData)
      .digest("hex");

    if (expectedHash !== verify_hash) {
      throw new Error("Invalid hash signature.");
    }

    // Fetch the transaction details using order_number
    const transaction = await Transaction.findById(order_number).session(
      session
    );
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

    // Process based on the status
    if (status === "completed") {
      // Increase the balance of the wallet
      wallet.balance += transaction.amount;
      await wallet.save({ session });

      // Update the transaction status
      transaction.status = "completed";
      await transaction.save({ session });
    } else if (status === "error") {
      transaction.status = "failed";
      await transaction.save({ session });
    } else if (status === "cancelled") {
      transaction.status = "cancelled";
      await transaction.save({ session });
    }

    // Commit the transaction
    await session.commitTransaction();
    res.status(200).send("Transaction processed successfully");
  } catch (error) {
    // Rollback the transaction if any error occurs
    await session.abortTransaction();
    console.error("Transaction confirmation error:", error);
    res.status(500).send("Error processing transaction");
  } finally {
    session.endSession();
  }
};

walletSchema.statics.banWallet = async function (walletId) {
  try {
    const wallet = await Wallet.findById(walletId);
    wallet.suspended = true;
    await wallet.save();
    return wallet;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

walletSchema.statics.unBanWallet = async function () {
  try {
    const wallet = await Wallet.findById(walletId);
    wallet.suspended = false;
    await wallet.save();
    return wallet;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const Wallet = mongoose.model("Wallet", walletSchema);
module.exports = Wallet;
