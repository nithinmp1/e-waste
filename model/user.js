const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: { type: String, default: null },
  last_name: { type: String, default: null },
  email: { type: String, unique: true },
  password: { type: String },
  profilePic: {type: String, default: null },
  token: { type: String , default: null },
});

module.exports = mongoose.model("user", userSchema);