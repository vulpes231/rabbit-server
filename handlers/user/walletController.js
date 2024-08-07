const Wallet = require("../../models/Wallet");

const deposit = async (req, res) => {
  const { amount, method } = req.body;
  const userId = req.userId;
  console.log(req.body);

  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({
      message: "Invalid amount. Please provide a valid deposit amount.",
    });
  }

  try {
    // Find the wallet for the user
    const wallet = await Wallet.findOne({ owner: userId });

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found." });
    }

    const transactionData = {
      amount: amount,
      method: method,
      creator: userId,
    };

    // Deposit the amount into the wallet
    const updatedWallet = await Wallet.deposit(userId, transactionData);

    res.status(200).json({
      message: "Deposit successful!",
      wallet: updatedWallet,
    });
  } catch (error) {
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
