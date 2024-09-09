const User = require("../../models/User");
// Wallet
const bcrypt = require("bcryptjs");
const Wallet = require("../../models/Wallet");

const getUser = async (req, res) => {
  const userId = req.userId;
  // console.log("fired", userId);
  try {
    const user = await User.findOne({ _id: userId });
    const wallet = await Wallet.findOne({ owner: userId });

    if (!user) return res.status(404).json({ message: "user not found!" });
    return res.status(200).json({ user, wallet });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occured" });
  }
};

const editUser = async (req, res) => {
  const { email, password } = req.body;
  const userId = req.userId;

  // Validate input
  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Update user email if provided
    if (email) {
      user.email = email;
    }

    // Update user password if provided
    if (password) {
      // Hash the new password
      const hashedPass = await bcrypt.hash(password, 10);
      user.password = hashedPass;
    }

    // Save the updated user
    await user.save();

    // Send response
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error updating user:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the user." });
  }
};

module.exports = { editUser, getUser };
