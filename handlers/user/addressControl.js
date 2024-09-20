const Address = require("../../models/Address");

const createCoinWallet = async (req, res) => {
  // const userId = req.userId
  const { coinName, network, address } = req.body;
  if (!coinName || !network || !address)
    return res.status(400).json({ message: "coin name and network required!" });
  try {
    const coinData = {
      coinName,
      network,
      address,
    };
    const newWallet = await Address.createCoinAddress(coinData);
    res.status(200).json({ newWallet });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "an error occured while creating wallet address" });
  }
};

const generateWalletAddress = async (req, res) => {
  const { coinName, network } = req.body;
  if (!coinName || !network)
    return res.status(400).json({ message: "coin name and network required!" });
  try {
    const coinData = {
      coinName,
      network,
    };
    const walletAddress = await Address.getCoinAddress(coinData);
    res.status(200).json({ walletAddress });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "an error occured while generating wallet address" });
  }
};

const getWallets = async (req, res) => {
  try {
    const walletAddress = await Address.getAllAddress();
    res.status(200).json({ walletAddress });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "an error occured while fetching addresses" });
  }
};

module.exports = { generateWalletAddress, createCoinWallet, getWallets };
