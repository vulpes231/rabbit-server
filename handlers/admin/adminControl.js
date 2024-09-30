const Admin = require("../../models/Admin");

const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.getAllAdmin();
    res.status(200).json({ admins });
  } catch (error) {
    res.status(500).json({ message: "an error occured while fetching admins" });
  }
};

module.exports = { getAdmins };
