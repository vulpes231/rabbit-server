const Admin = require("../../models/Admin");

const logoutAdmin = async (req, res) => {
  const user = req.admin;

  try {
    const userMatch = await Admin.findOne({ username: user });
    if (!userMatch) return res.status(404).json({ message: "User not found!" });

    userMatch.refreshToken = null;
    await userMatch.save();
    res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occured." });
  }
};

module.exports = { logoutAdmin };
