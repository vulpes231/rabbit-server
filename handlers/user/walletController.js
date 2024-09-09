const Wallet = require("../../models/Wallet");
const mongoose = require("mongoose");
const axios = require("axios");
const Transaction = require("../../models/Transaction");
const { v4: uuid } = require("uuid");
const crypto = require("crypto");

const generateSignature = (body, apiKey) => {
  const hash = crypto.createHash("md5").update(body).digest("base64");
  const signature = `${hash}${apiKey}`;
  return crypto.createHash("md5").update(signature).digest("hex");
};

const createWallet = async (currency, network, orderId, callbackUrl) => {
  const apiKey = process.env.APIKEY;
  const body = JSON.stringify({
    currency,
    network,
    order_id: orderId,
    url_callback: callbackUrl,
  });

  const sign = generateSignature(body, apiKey);

  try {
    const response = await axios.post(
      "https://api.cryptomus.com/v1/wallet",
      body,
      {
        headers: {
          merchant: process.env.MERCHANT_ID,
          sign: sign,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error creating wallet:", error);
    throw new Error("Failed to create wallet");
  }
};

const deposit = async (req, res) => {
  const { currency, network, amount } = req.body;
  const userId = req.userId;

  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({
      message: "Invalid amount. Please provide a valid deposit amount.",
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find the wallet for the user
    const wallet = await Wallet.findOne({ owner: userId }).session(session);

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found." });
    }

    const transaction = await Transaction.create(transactionData);

    const orderId = transaction._id;

    const url_callback = `${process.env.SITE}/callback`;

    const walletResponse = await createWallet(
      currency,
      network,
      orderId,
      url_callback
    );

    console.log(walletResponse);

    const transactionData = {
      amount: amount,
      network: network,
      currency: currency,
      creator: userId,
    };

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: "Deposit successful!",
      walletData: walletResponse.result,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Error depositing funds:", error);
    res
      .status(500)
      .json({ message: "An error occurred while processing the deposit." });
  }
};

const getUserBalance = async (req, res) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(400).json({ message: "Bad request!" });
  }

  try {
    const walletBalance = await Wallet.getBalance(userId);

    // Return the balance
    res.status(200).json({
      walletBalance,
    });
  } catch (error) {
    console.error("Error fetching balance:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching balance." });
  }
};

module.exports = {
  getUserBalance,
  deposit,
};
