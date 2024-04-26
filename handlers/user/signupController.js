const User = require("../../models/User");
const bcrypt = require("bcryptjs");

const signupUser = async (req, res) => {
  const { member, pass, mail } = req.body;
  // console.log(req.body);
  if (!member || !pass || !mail)
    return res.status(400).json({ message: "bad request!" });

  try {
    const user = await User.findOne({ username: member });
    if (user)
      return res.status(409).json({ message: "username already taken" });

    const hashedPass = await bcrypt.hash(pass, 10);

    const newUser = await User.create({
      username: member,
      password: hashedPass,
      email: mail,
    });

    res
      .status(201)
      .json({ message: `user ${newUser.username} created succesfully.` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error. Try again later" });
  }
};

module.exports = { signupUser };
