const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  publishedDate: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
  },
  pageCount: {
    type: Number,
    required: true,
  },
  thumbnail: {
    type: String,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Author",
  },
});

module.exports = mongoose.model("Book", bookSchema);

console.log("module being exported are",  module.exports);
