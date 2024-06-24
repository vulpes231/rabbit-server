const Wallet = require("../../models/Wallet");

async function confirmTransaction(req, res) {
  const { transactionId } = req.params;

  console.log(transactionId);
  const isAdmin = req.isAdmin;
  if (!isAdmin) return res.status(403).json({ message: "forbidden access" });

  try {
    // Confirm the transaction
    const wallet = await Wallet.confirmTransaction(transactionId);

    res.status(200).json({
      message: "Transaction confirmed successfully!",
      wallet,
    });
  } catch (error) {
    console.error("Error confirming transaction:", error);
    res.status(500).json({ message: "An error occurred." });
  }
}

const getAllWallets = async (req, res) => {
  const isAdmin = req.isAdmin;
  if (!isAdmin) return res.status(403).json({ message: "forbidden access" });
  try {
    const wallets = await Wallet.getAllWallets();
    res.status(200).json({ wallets });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error. Try again later" });
  }
};

module.exports = {
  confirmTransaction,
  getAllWallets,
};
