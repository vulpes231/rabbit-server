const Transaction = require("../../models/Transaction");

const getAllTrnx = async (req, res) => {
  const isAdmin = req.isAdmin;
  if (!isAdmin) return res.status(403).json({ message: "forbidden access" });
  try {
    const allTrnx = await Transaction.getTransactions();
    res.status(200).json({ trnx: allTrnx });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error!" });
  }
};

const completeTransaction = async (req, res) => {
  const { transactionId } = req.body;

  const isAdmin = req.isAdmin;
  if (!isAdmin) return res.status(403).json({ message: "forbidden access" });

  try {
    // Complete the order using the static method from the Order model
    const completedTrnx = await Order.completeOrder(transactionId);

    if (!completedTrnx) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json({ order: completedTrnx });
  } catch (error) {
    console.error("Error completing order:", error);
    res.status(500).json({ message: "An error occurred." });
  }
};

module.exports = {
  getAllTrnx,
  completeTransaction,
};
