const Order = require("../../models/Order");

const getAllOrders = async (req, res) => {
  const isAdmin = req.isAdmin;
  if (!isAdmin) return res.status(403).json({ message: "forbidden access" });
  try {
    const orders = await Order.getAllOrders();

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error getting user orders:", error);
    res.status(500).json({ message: "An error occurred." });
  }
};

const completeOrder = async (req, res) => {
  const { orderId } = req.body;

  const isAdmin = req.isAdmin;
  if (!isAdmin) return res.status(403).json({ message: "forbidden access" });

  try {
    // Complete the order using the static method from the Order model
    const completedOrder = await Order.completeOrder(orderId);

    if (!completedOrder) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json({ order: completedOrder });
  } catch (error) {
    console.error("Error completing order:", error);
    res.status(500).json({ message: "An error occurred." });
  }
};

module.exports = { completeOrder, getAllOrders };
