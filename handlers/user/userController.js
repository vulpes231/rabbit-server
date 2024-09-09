const User = require("../../models/User");
const bcrypt = require("bcryptjs");

const getUser = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await User.findOne({ _id: userId });

    if (!user) return res.status(404).json({ message: "user not found!" });
    return res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occured" });
  }
};

const editUser = async (req, res) => {
  const { email, password, newPass } = req.body;
  const userId = req.userId;

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
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch)
        return res.status(400).json({ message: "Incorrect password" });

      const hashedPass = await bcrypt.hash(newPass, 10);
      user.password = hashedPass;
    }

    // Save the updated user
    await user.save();

    // Send response
    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the user." });
  }
};

module.exports = { editUser, getUser };
