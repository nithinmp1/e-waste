const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  product: { type: String, default: null },
  userId: { type: mongoose.Schema.Types.ObjectId, default: null },
  location: { type: String, unique: true },
});

module.exports = mongoose.model("product", userSchema);