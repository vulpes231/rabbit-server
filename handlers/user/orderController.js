const Order = require("../../models/Order");

const createOrder = async (req, res) => {
  try {
    const { item, price } = req.body;

    if (!item || !price) {
      return res
        .status(400)
        .json({ message: "Product name and price are required." });
    }

    const userId = req.userId;

    const orderData = {
      creator: userId,
      item,
      price,
    };

    try {
      const newOrder = await Order.createOrder(orderData, userId);

      res.status(201).json({ order: newOrder });
    } catch (error) {
      if (error.message === "Insufficient balance!") {
        return res.status(400).json({ message: error.message });
      } else {
        console.error("Error creating order:", error);
        res.status(500).json({ message: "An error occurred." });
      }
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ message: "An unexpected error occurred." });
  }
};

const getUserOrders = async (req, res) => {
  const userId = req.userId; // Assuming userId is extracted from authentication middleware

  try {
    // Find orders for the user
    const userOrders = await Order.find({ creator: userId });

    res.status(200).json({ userOrders: userOrders });
  } catch (error) {
    console.error("Error getting user orders:", error);
    res.status(500).json({ message: "An error occurred." });
  }
};

const getOrderById = async (req, res) => {
  const { orderId } = req.params;

  if (!orderId) return res.status(400).json({ message: "Bad request" });
  try {
    const order = await Order.findOne({ _id: orderId });
    if (!order) return res.status(404).json({ message: "order not found" });

    res.status(200).json({ order });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred." });
  }
};

module.exports = { createOrder, getUserOrders, getOrderById };
