const mongoose = require("mongoose");
const { required } = require("nodemon/lib/config");

const BookSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
  },
  isbn: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  bookFile: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  publication: {
    type: String,
    required: true,
  },
  edition: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Book", BookSchema);
