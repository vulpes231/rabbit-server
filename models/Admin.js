const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const adminSchema = new Schema({
  username: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    default: true,
  },
  superUser: {
    type: Boolean,
    default: false,
  },
  refreshToken: {
    type: String,
    default: null,
  },
});

adminSchema.statics.getAllAdmin = async function () {
  try {
    const admins = await this.find();
    return admins;
  } catch (error) {
    throw error;
  }
};

module.exports = mongoose.model("Admin", adminSchema);
