const bcrypt = require("bcryptjs");
const Admin = require("../../models/Admin");

const createAdmin = async (req, res) => {
  const superUser = req.isSuperUser;
  if (!superUser) return res.status(403).json({ message: "forbidden!" });
  const { username, password, email } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Bad request!" });
  }

  try {
    const existingAdmin = await Admin.findOne({ username: username });
    if (existingAdmin) {
      return res.status(409).json({ message: "Username taken!" });
    }

    const hashPass = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      username: username.toLowerCase(),
      password: hashPass,
      email: email.toLowerCase() || "",
      isAdmin: true,
    });

    const savedAdmin = await newAdmin.save();

    res
      .status(201)
      .json({ message: `New admin ${username} created successfully.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred. Try again later." });
  }
};

module.exports = { createAdmin };
