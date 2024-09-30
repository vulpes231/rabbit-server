const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  item: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "pending",
  },
  customerName: {
    type: String,
  },
  qty: {
    type: String,
  },
  note: {
    type: String,
  },
  customerEmail: {
    type: String,
    required: true,
  },
});

const User = require("./User");
const Completed = require("./Completed");

orderSchema.statics.getAllOrders = async function () {
  try {
    const orders = await this.find();
    return orders;
  } catch (error) {
    throw error;
  }
};

orderSchema.statics.getOrderById = async function (orderId) {
  try {
    const order = await this.findById(orderId);
    if (!order) {
      throw new Error("Order not found!");
    }
    return order;
  } catch (error) {
    throw error;
  }
};

orderSchema.statics.createOrder = async function (orderData, userId) {
  const session = await mongoose.startSession();
  session.startTransaction();

  const { price, qty } = orderData;

  try {
    const opts = { session };
    const User = require("./User");
    const Wallet = require("./Wallet");

    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new Error("User not found!");
    }

    const userWallet = await Wallet.findOne({ owner: userId }).session(session);
    if (!userWallet) {
      throw new Error("Wallet not found!");
    }

    if (userWallet.suspended) {
      throw new Error("wallet banned! contact admin");
    }

    // Handle quantity, defaulting to 1 if not provided
    const orderQty = qty && qty > 0 ? parseFloat(qty) : 1;
    const totalCost = orderQty * price;

    if (userWallet.balance < totalCost) {
      throw new Error("Insufficient balance!");
    }

    userWallet.balance -= totalCost;
    await userWallet.save(opts);

    const newOrder = new this(orderData);
    await newOrder.save(opts);

    user.pendingOrders++;
    await user.save(opts);

    await session.commitTransaction();
    return newOrder;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

orderSchema.statics.completeOrder = async function (orderId, orderData) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await Order.findById(orderId).session(session);
    if (!order) {
      throw new Error("Order not found!");
    }

    const user = await User.findById(order.creator).session(session);
    if (!user) {
      throw new Error("User not found!");
    }

    const orderToComplete = {
      detail: orderData.detail,
      orderId: order._id,
      customerId: user._id,
      customerName: user.username,
    };

    await Completed.create([orderToComplete], { session });

    user.pendingOrders = (user.pendingOrders || 0) - 1;
    user.completedOrders = (user.completedOrders || 0) + 1;

    await user.save({ session });

    order.status = "completed";
    await order.save({ session });

    await session.commitTransaction();
    return order;
  } catch (error) {
    await session.abortTransaction();
    console.error("Error completing order:", error);
    throw new Error("Failed to complete the order. Please try again later.");
  } finally {
    session.endSession();
  }
};

orderSchema.statics.deleteOrder = async function (orderId) {
  try {
    const deletedOrder = await this.findByIdAndDelete(orderId);
    return deletedOrder;
  } catch (error) {
    throw error;
  }
};

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
