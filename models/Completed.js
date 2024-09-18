const { default: mongoose } = require("mongoose");
const Schema = mongoose.Schema;

const completedSchema = new Schema({
  orderId: {
    type: Schema.Types.ObjectId,
    ref: "Order",
  },
  detail: {
    type: String,
    required: true,
  },
  attachment: {
    type: String,
  },
  customerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

completedSchema.statics.getCompletedOrders = async function () {
  try {
    const completedOrders = await Completed.find();
    return completedOrders;
  } catch (error) {
    console.error("cannot get completed orders", error);
    throw error;
  }
};

completedSchema.statics.getCompletedUserOrders = async function (userId) {
  try {
    const userCompletedOrders = await Completed.find({ customerId: userId });
    return userCompletedOrders;
  } catch (error) {
    console.error("cannot get user orders", error);
    throw error;
  }
};

const Completed = mongoose.model("Completed", completedSchema);
module.exports = Completed;
