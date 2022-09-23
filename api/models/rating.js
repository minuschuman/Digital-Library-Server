const mongoose = require("mongoose");

const RatingSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  isbn: {
    type: String,
    required: true,
  },
  bookRating: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Rating", RatingSchema);
