const express = require("express");
const router = express.Router();
const Books = require("../models/book");
console.log(Books);
const Author = require("../models/author");
const mongoose = require("mongoose");

// allowed images files formats for upload
// const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"];

// const upload = multer({
//   dest: fileUploadPath,
//   fileFilter: (req, file, callback) => {
//     if (imageMimeTypes.indexOf(file.mimetype) == -1) {
//       callback(null, false);
//     } else {
//       callback(null, true);
//     }
//   },
// });

// GET Route to load books page
router.get("/", async (req, res) => {
  const searchQuery = {};
  if (req.query.bookToFind) {
    searchQuery.title = req.query.bookToFind;
  }
  const books = await findBooks(searchQuery);
  // console.log(books)
  res.render("books", { books: books, searchQuery, error: null });
});

// Add New Book Route
router.get("/new", async (req, res) => {
  try {
    const authors = await Author.find({});
    // console.log(authors);
    res.render("books/new", { authors: authors });
  } catch (err) {
    res.redirect("/books");
  }
});

// GET Route to load individual book
router.get("/:id", async (req, res) => {
  try {
    const bookId = req.params.id;
    console.log("book id requested", bookId);
    const book = await Books.findById(bookId).populate("author");
    console.log(book);
    res.render("books/view", { book });
  } catch (error) {}
  // TODO: figure out how to create and render dynamic views according to 'id'
});

// Route for creating new book
router.post("/", async (req, res) => {
  const {
    title,
    author: authorId, // destructering the variable author and setting it as authorId
    published,
    pages,
    created,
    thumbnail,
    description,
  } = req.body;
  const authorObj = await Author.findById(authorId);

  const book = new Books({
    title: title,
    publishedDate: new Date(published),
    pageCount: pages,
    // setting the property as undefined so that default value is set if empty value or null is passed
    createdAt: !created ? undefined : new Date(created),
    author: authorObj,
    description: description,
    thumbnail: thumbnail,
  });

  try {
    await book.save();
    res.redirect("/books");
  } catch (err) {
    console.log("error saving book:", err);
    const authors = await Author.find({});
    res.render("books/new", { book, authors, error: err });
  }
});

//Route for serving edit page
router.get("/edit/:id", async (req, res) => {
  try {
    const bookId = req.params.id;
    console.log("book id requested", bookId);
    const book = await Books.findById(bookId).populate("author");
    const authors = await Author.find({});
    console.log(book.title);
    res.render("books/edit", { book, authors });
  } catch (error) {
    console.log(error);
  }
});

// Rout for updating the book info
router.put("/", async (req, res) => {
  console.log("From put route:", req.body);

  const {
    id,
    title,
    author: authorId, // destructering the variable author and setting it as authorId
    published,
    pages,
    created,
    thumbnail,
    description,
  } = req.body;
  const authorObj = await Author.findById(authorId);

  console.log(
    id,
    title,
    authorObj,
    authorId,
    pages,
    published,
    created,
    thumbnail,
    description
  );

  try {
    await Books.findByIdAndUpdate(
      id,
      {
        title: title,
        publishedDate: new Date(published),
        pageCount: pages,
        createdAt: new Date(created),
        author: authorObj,
        description: description,
        thumbnail: thumbnail,
      }
    );
    res.redirect("/books")
  } catch (error) {
    console.log("error while updating: ", error);
    const book = await Books.findById(id);
    const authors = await Author.find({});
    res.render("authors/edit", {book, authors })
  }
});

router.delete("/", async (req, res) => {
  console.log(req.body.id);
  const bookId = req.body.id;
  try {
    await Books.deleteOne({ _id: bookId });
    res.redirect("/books");
  } catch (error) {
    const books = await findBooks({});
    res.render("books", {
      books,
      error: "Sorry, Couldn't Delete!",
      bookToFind: null,
    });
  }
});

// Utility functions
// To load books from db and populate authors
const findBooks = async (bookToFind) => {
  const books = await Books.find(bookToFind).populate("author");
  return books;
};

module.exports = router;
