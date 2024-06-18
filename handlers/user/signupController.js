const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const Wallet = require("../../models/Wallet");

const signupUser = async (req, res) => {
  const { member, pass, mail } = req.body;
  console.log(req.body);
  if (!member || !pass || !mail)
    return res.status(400).json({ message: "Bad request!" });

  try {
    const user = await User.findOne({ username: member });
    if (user)
      return res.status(409).json({ message: "Username already taken" });

    const hashedPass = await bcrypt.hash(pass, 10);

    // Create the new user
    const newUser = await User.create({
      username: member,
      password: hashedPass,
      email: mail,
    });

    // Create a wallet for the new user
    const newWallet = await Wallet.create({
      balance: 0, // You can initialize the balance to any default value
      owner: newUser._id, // Assign the owner as the new user's ObjectId
    });

    res
      .status(201)
      .json({ message: `User ${newUser.username} created successfully.` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error. Try again later" });
  }
};

module.exports = { signupUser };
