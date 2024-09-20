const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const addressSchema = new Schema({
  coinName: {
    type: String,
  },
  network: {
    type: String,
  },
  address: {
    type: String,
  },
});

//static method to add address
addressSchema.statics.createCoinAddress = async function (coinData) {
  const { coinName, network, address } = coinData;
  try {
    const newAddress = await Address.create({ coinName, network, address });
    return newAddress;
  } catch (error) {
    console.error(error);
    throw new Error("Cannot create address try again.");
  }
};

//static method to get coin address
addressSchema.statics.getCoinAddress = async function (coinData) {
  const { coinName, network } = coinData;
  try {
    const coinAddress = await Address.findOne({
      coinName: coinName,
      network: network,
    });
    return coinAddress;
  } catch (error) {
    console.error(error);
    throw new Error("cannot get address. try again.");
  }
};
//static method to get all coin address
addressSchema.statics.getAllAddress = async function () {
  try {
    const coinAddresses = await Address.find();
    return coinAddresses;
  } catch (error) {
    console.error(error);
    throw new Error("cannot get address. try again.");
  }
};

const Address = mongoose.model("Address", addressSchema);
module.exports = Address;
