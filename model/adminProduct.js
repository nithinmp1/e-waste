const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  productCode: { type: String},
  userId: { type: mongoose.Schema.Types.ObjectId, default: null },
  productName: { type: String},
  productColor: { type: Array},
  productSize: { type: Array},
  productCount: { type: String},
  productPrice: { type: String},
  productImage: { type: Array},
});

module.exports = mongoose.model("adminProducts", userSchema);