const Completed = require("../../models/Completed");

const getUserCompletedOrders = async (req, res) => {
  const userId = req.userId;
  try {
    const userCompletedOrders = await Completed.getCompletedUserOrders(userId);
    res.status(200).jsoon({ userCompletedOrders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occured." });
  }
};

module.exports = { getUserCompletedOrders };
