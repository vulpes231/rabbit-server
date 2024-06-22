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

// async function confirmTransaction(req, res) {
//   const { transactionId } = req.params;

//   try {
//     const updatedTransaction = await Transaction.confirmTransaction(
//       transactionId
//     );

//     res.status(200).json({
//       message: `Transaction ${transactionId} confirmed successfully!`,
//       transaction: updatedTransaction,
//     });
//   } catch (error) {
//     console.error("Error confirming transaction:", error);
//     res.status(500).json({ message: "An error occurred." });
//   }
// }

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

const getAllTrnx = async (req, res) => {
  try {
    const allTrnx = await Transaction.getTransactions();
    res.status(200).json({ trnx: allTrnx });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error!" });
  }
};

module.exports = {
  createTransaction,
  // confirmTransaction,
  getUserTransactions,
  getAllTrnx,
};
