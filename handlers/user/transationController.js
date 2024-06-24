const Transaction = require("../../models/Transaction");

async function createTransaction(req, res) {
  const { creator, amount, method } = req.body;
  try {
    const transactionData = { creator, amount, method };
    const newTransaction = await Transaction.createTransaction(transactionData);

    res.status(201).json({
      message: "Transaction created successfully!",
      transaction: newTransaction,
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ message: "An error occurred." });
  }
}

async function getUserTransactions(req, res) {
  const { userId } = req.params;

  try {
    const transactions = await Transaction.getUserTransactions(userId);

    res.status(200).json({ transactions });
  } catch (error) {
    console.error("Error fetching user transactions:", error);
    res.status(500).json({ message: "An error occurred." });
  }
}

module.exports = {
  createTransaction,
  getUserTransactions,
};
