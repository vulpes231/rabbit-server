const User = require("../../models/User");

const logoutUser = async (req, res) => {
  const user = req.user;
  try {
    const userMatch = await User.findOne({ username: user });
    if (!userMatch) return res.status(400).json({ message: "Bad request!" });

    userMatch.refreshToken = null;
    await userMatch.save();
    res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occured." });
  }
};

module.exports = { logoutUser };
