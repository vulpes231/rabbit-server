const Server = require("../../models/Server");

const addServer = async (req, res) => {
  const { location, ram, price } = req.body;
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occured" });
  }
};

const orderServer = async (req, res) => {
  const { location, ram, price } = req.body;
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occured" });
  }
};

module.exports = {
  addServer,
  orderServer,
};
