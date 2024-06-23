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

orderSchema.statics.createOrder = async function (orderData) {
  try {
    const newOrder = new this(orderData);
    await newOrder.save();
    return newOrder;
  } catch (error) {
    throw error;
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
