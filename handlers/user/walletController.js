const Wallet = require("../../models/Wallet");

const depositAuto = async (req, res) => {
  const { coinName, network, amount } = req.body;
  const userId = req.userId;

  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({
      message: "Invalid amount. Please provide a valid deposit amount.",
    });
  }

  try {
    const depositData = { coinName, network, amount };
    const createInvoice = await Wallet.depositAuto(userId, depositData);
    res.status(200).json({ message: "invoice created", createInvoice });
  } catch (error) {
    console.error("Error depositing funds:", error);
    res
      .status(500)
      .json({ message: "An error occurred while creating invoice." });
  }
};

const depositManually = async (req, res) => {
  const userId = req.userId;
  const { coinName, network, amount } = req.body;

  if (!coinName || !network || !amount)
    return res
      .status(400)
      .json({ message: "coinname, network, amount required!" });
  try {
    const depositData = { coinName, network, amount };

    const transactiondata = await Wallet.depositManual(userId, depositData);
    res.status(200).json({ transactiondata });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "an errror occured. try again later" });
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
  depositAuto,
  depositManually,
};
