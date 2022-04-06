const mongoose = require("mongoose");
const { required } = require("nodemon/lib/config");

const orderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
});

module.exports = mongoose.model("Order", orderSchema);
