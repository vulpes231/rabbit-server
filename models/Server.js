const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const serverSchema = new Schema({
  location: {
    type: String,
  },
  ram: {
    type: String,
  },
  price: {
    type: String,
  },
  os: {
    type: String,
  },
});

module.exports = mongoose.model("Server", serverSchema);
