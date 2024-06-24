const Order = require("../../models/Order");

const createOrder = async (req, res) => {
  try {
    const { item, price } = req.body;
    const userId = req.userId; // Assuming userId is extracted from authentication middleware

    // Create a new order object
    const orderData = {
      creator: userId,
      item,
      price,
    };

    // Create the order using the static method from the Order model
    const newOrder = await Order.createOrder(orderData);

    res.status(201).json({ order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "An error occurred." });
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

module.exports = { createOrder, getUserOrders };
