const express = require("express");
const router = express.Router();
const Books = require("../models/book");
console.log(Books);
const Author = require("../models/author");
const multer = require("multer"); // library to handle multipart form that may contain images
const path = require("path");
const fileUploadPath = path.join("public", Books.coverImgDir);

const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"]; // allowed images files formats for upload
const upload = multer({
  dest: fileUploadPath,
  fileFilter: (req, file, callback) => {
    if (imageMimeTypes.indexOf(file.mimetype) == -1) {
      callback(new Error("file not supported"));
    } else {
      callback(null, true);
    }
  },
});

router.get("/", async (req, res) => {
  const books = await Books.find({}).populate("author");
  // console.log("books recieved form DB", books);
  res.render("books", { books: books });
});

router.get("/new", async (req, res) => {
  try {
    const authors = await Author.find({});
    res.render("books/new", { authors: authors });
  } catch (err) {
    res.redirect("/books");
  }
});

router.post("/", upload.single("thumbnail"), async (req, res) => {
  const filename = req.file != null ? req.file.filename : null;
  const {
    title,
    author: authorId,
    published,
    pages,
    created,
    description,
  } = req.body;
  const authorObj = await Author.findById(authorId);
  console.log(
    title,
    authorObj,
    authorId,
    pages,
    published,
    created,
    description,
    req.file
  );

  const book = new Books({
    title: title,
    publishedDate: new Date(published),
    pageCount: pages,
    // setting the property as undefined so that default value is set if empty value or null is passed
    createdAt: !created ? undefined : new Date(created),
    author: authorObj,
    description: description,
    thumbnail: filename,
  });

  try {
    await book.save();
    res.redirect("/books");
  } catch (err) {
    console.log("error saving book:", err);
    res.render("/books/new");
  }
});

module.exports = router;
