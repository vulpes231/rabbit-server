const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signinUser = async (req, res) => {
  const { username, password } = req.body;
  // console.log(req.body);

  if (!username || !password)
    return res.status(400).json({ message: "Bad request!" });

  try {
    const user = await User.findOne({ username: username });
    if (!user) return res.status(404).json({ message: "user does not exist!" });

    const passMatch = await bcrypt.compare(password, user.password);
    if (!passMatch)
      return res.status(401).json({ message: "invalid username OR password!" });

    const accessToken = jwt.sign(
      { user: user.username },
      { userId: user._id },
      process.env.ACCESS_TOKEN,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { user: user.username },
      process.env.REFRESH_TOKEN,
      { expiresIn: "1 day" }
    );

    user.refreshToken = refreshToken;

    await user.save();
    res.cookie("jwt", refreshToken, { maxAge: 86400000, httpOnly: true });

    res.status(200).json({ accessToken, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error, Try again later" });
  }
};

module.exports = { signinUser };
