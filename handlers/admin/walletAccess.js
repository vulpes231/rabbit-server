const Wallet = require("../../models/Wallet");

async function confirmTransaction(req, res) {
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
  } = req.body;

  try {
    const orderData = {
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
    };

    const wallet = await Wallet.confirmTransaction(orderData);
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

const suspendWallet = async (req, res) => {
  const isAdmin = req.isAdmin;
  if (!isAdmin) return res.status(403).json({ message: "forbidden access" });

  const { walletId } = req.params;
  if (!walletId)
    return res.status(400).json({ message: "wallet ID required!" });
  try {
    await Wallet.banWallet(walletId);
    res.status(200).json({ message: "wallet banned." });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "an error occured while banning wallet. try again later",
    });
  }
};

const unsuspendWallet = async (req, res) => {
  const isAdmin = req.isAdmin;
  if (!isAdmin) return res.status(403).json({ message: "forbidden access" });

  const { walletId } = req.params;
  if (!walletId)
    return res.status(400).json({ message: "wallet ID required!" });
  try {
    await Wallet.unBanWallet(walletId);
    res.status(200).json({ message: "wallet unbanned." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error. Try again later" });
  }
};

module.exports = {
  getAllWallets,
  confirmTransaction,
  suspendWallet,
  unsuspendWallet,
};
