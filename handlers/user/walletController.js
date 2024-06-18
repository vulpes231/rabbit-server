const Transaction = require("../../models/Transaction");
const Wallet = require("../../models/Wallet");
// Transaction

const deposit = async (req, res) => {
  const { amount, method } = req.body;
  const userId = req.userId;

  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({
      message: "Invalid amount. Please provide a valid deposit amount.",
    });
  }

  try {
    // Find the wallet of the user
    const wallet = await Wallet.findOne({ owner: userId });
    if (!wallet) {
      return res
        .status(404)
        .json({ message: "Wallet not found. Please create a wallet first." });
    }

    wallet.balance += parseFloat(amount);
    await wallet.save();

    const transaction = new Transaction({
      creator: userId,
      amount: parseFloat(amount),
      method: method,
    });

    await transaction.save();

    res.status(200).json({
      message: `Deposited ${amount} into wallet. New balance: ${wallet.balance}`,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "An error occurred while processing the deposit." });
  }
};

const getBalance = async (req, res) => {
  const userId = req.params.id; // Assuming 'id' is the parameter name in your route
  if (!userId) return res.status(400).json({ message: "Bad request!" });

  try {
    const balance = await Wallet.findOne({ owner: userId });
    if (!balance) {
      return res.status(404).json({ message: "Wallet not found" });
    }
    res.status(200).json({ balance: balance.balance }); // Return only the balance field
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred" });
  }
};

module.exports = {
  getBalance,
  deposit,
};
