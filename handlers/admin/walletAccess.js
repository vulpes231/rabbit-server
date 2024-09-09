const Wallet = require("../../models/Wallet");
const crypto = require("crypto");

// Function to verify the signature
const verifySignature = (body, receivedSignature, apiKey) => {
  // Create MD5 hash of the body
  const hash = crypto.createHash("md5").update(body).digest("base64");
  // Combine hash with API key and hash again
  const expectedSignature = crypto
    .createHash("md5")
    .update(`${hash}${apiKey}`)
    .digest("hex");
  return expectedSignature === receivedSignature;
};

async function confirmTransaction(req, res) {
  const { order_id, status, payment_amount_usd, sign, is_final } = req.body;
  const apiKey = process.env.APIKEY;

  // Verify the signature
  const body = JSON.stringify(req.body);
  if (!verifySignature(body, sign, apiKey)) {
    return res.status(400).json({ message: "Invalid signature" });
  }

  try {
    const updateData = {
      status: status,
      transactionId: order_id,
      amount: payment_amount_usd,
      paid: is_final,
    };

    const wallet = await Wallet.confirmTransaction(updateData);
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
