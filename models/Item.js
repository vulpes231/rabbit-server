const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const itemSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  info: {
    type: String,
  },
  group: {
    type: String,
  },
  price: {
    type: Number,
  },
});

module.exports = mongoose.model("Item", itemSchema);
