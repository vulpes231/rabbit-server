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
});

orderSchema.statics.getAllOrders = function () {
  return this.find();
};

orderSchema.statics.createOrder = async function (orderData, userId) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const opts = { session };
    const User = require("./User");
    const Wallet = require("./Wallet");
    // Check if user exists
    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new Error("User not found!");
    }

    // Get user wallet
    const userWallet = await Wallet.findOne({ owner: userId }).session(session);
    if (!userWallet) {
      throw new Error("Wallet not found!");
    }

    // Check if user has sufficient balance
    if (userWallet.balance < orderData.price) {
      throw new Error("Insufficient balance!");
    }

    // Deduct balance from user wallet
    userWallet.balance -= orderData.price;
    await userWallet.save(opts);

    // Create new order and save it
    const newOrder = new this(orderData);
    await newOrder.save(opts);

    // Update pendingOrders count for the user
    user.pendingOrders++;
    await user.save(opts);

    await session.commitTransaction();
    session.endSession();

    return newOrder;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error; // Propagate the error to handle it in the controller
  }
};

orderSchema.statics.completeOrder = async function (orderId) {
  try {
    const getOrder = await this.findById(orderId);
    if (!getOrder) {
      throw new Error("Order not found!");
    }

    const User = require("./User");

    const user = await User.findByIdAndUpdate(
      getOrder.creator,
      {
        $inc: { pendingOrders: -1, completedOrders: 1 },
        status: "completed",
      },
      { new: true }
    );

    const order = await this.findByIdAndUpdate(
      orderId,
      { status: "completed" },
      { new: true }
    );

    return order;
  } catch (error) {
    throw error;
  }
};

// Static method to delete an order
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
