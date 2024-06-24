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

module.exports = {
  getAllTrnx,
};
