const { format } = require("date-fns");
const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  orders: {
    type: Number,
    default: 0,
  },
  earnedXP: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("User", userSchema);
