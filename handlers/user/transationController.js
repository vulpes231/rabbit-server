const Transaction = require("../../models/Transaction");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const getUserTransactions = async (req, res) => {
  const userId = req.userId;
  const uid = new ObjectId(userId);
  try {
    const trnx = await Transaction.find({ creator: uid });
    res.status(200).json({ trnx });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred." });
  }
};

module.exports = { getUserTransactions };
