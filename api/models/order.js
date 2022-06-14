const mongoose = require("mongoose");
const { required } = require("nodemon/lib/config");

const orderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["returned", "pending", "cancelled"],
    required: true,
    default: "pending",
  },
});

module.exports = mongoose.model("Order", orderSchema);
