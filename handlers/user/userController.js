const User = require("../../models/User");
const bcrypt = require("bcryptjs");

const getUser = async (req, res) => {
  const userId = req.userId;
  // console.log("fired", userId);
  try {
    const user = await User.findOne({ _id: userId });

    if (!user) return res.status(404).json({ message: "user not found!" });
    return res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occured" });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPass, newPass } = req.body;
    if ((!currentPass, !newPass))
      return res.status(400).json({ message: "password fields required!" });

    const user = req.user;
    console.log(user);

    const userInfo = await User.findOne({ username: user });
    console.log(userInfo);

    //compare passwords
    const passwordMatch = await bcrypt.compare(currentPass, userInfo.password);
    if (!passwordMatch)
      return res
        .status(400)
        .json({ message: "Incorrect current password entered!" });

    // hash new pass
    const hashedPass = await bcrypt.hash(newPass, 10);
    userInfo.password = newPass ? hashedPass : userInfo.password;
    await userInfo.save();

    res.status(200).json({ message: `Passwords changed successfully.` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error. Try again later" });
  }
};

module.exports = { changePassword, getUser };
