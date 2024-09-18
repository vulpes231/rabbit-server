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

const getOrder = async (req, res) => {
  const isAdmin = req.isAdmin;
  if (!isAdmin) return res.status(403).json({ message: "forbidden access!" });

  const { orderId } = req.params;
  if (!orderId)
    return res.status(403).json({ message: "orderId is required!" });
  try {
    const order = await Order.getOrderById(orderId);

    res.status(200).json({ order });
  } catch (error) {
    console.error("Error getting order:", error);
    res.status(500).json({ message: "An error occurred." });
  }
};

const completeOrder = async (req, res) => {
  const isAdmin = req.isAdmin;
  if (!isAdmin) return res.status(403).json({ message: "forbidden access" });

  const { orderId } = req.params;
  const { orderDetails, attachment } = req.body;

  if (!orderDetails)
    return res.status(403).json({ message: "order detail is required" });

  try {
    const orderData = {
      detail: orderDetails,
    };

    await Order.completeOrder(orderId, orderData);
    res.status(200).json({ message: "order conmpleted" });
  } catch (error) {
    console.error("Error completing order:", error);
    res.status(500).json({ message: "An error occurred." });
  }
};

module.exports = { completeOrder, getAllOrders, getOrder };
