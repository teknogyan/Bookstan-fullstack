const express = require("express");
const Author = require("../models/author");
const { default: mongoose } = require("mongoose");
const router = express.Router();

//custom middleware
const authMiddleware = require("../middlewares/authMiddleware")
router.use(authMiddleware); //middleware for auth

// route to get authors from db and display them with the ability to search authors
router.get("/", async (req, res) => {
  const authorToFind = req.query.authorToFind;
  const searchOptions = {}; // if no author is being looked for, all authors will be shown
  if (authorToFind !== null && authorToFind !== "") {
    searchOptions.name = new RegExp(authorToFind, "i");
  }

  const authors = await Author.find(searchOptions);
  res.render("authors", { authors, inputQuery: authorToFind });
});

// route to the new author page
router.get("/new", (req, res) => {
  res.render("authors/new", { authorName: "Author's name here", err: null });
});

// route for creating new author
router.post("/", async (req, res) => {
  // console.log("POST => ", req.body);
  try {
    const authorName = req.body.authorName;
    const author = new Author({ name: authorName }); //creates new author using the declared Schema
    const authorExists = await Author.exists({ name: authorName }); // checking if author already exist in the database


    if (authorExists) {
      res.render("authors/new", {
        authorName: author.name,
        err: `Author already exists`,
      });
    } else {
      await author.save();
      res.redirect("authors");
    }

    // if author failed to be invalid according to the Schema
  } catch (error) {
    console.log("error occured while saving to DB: ", error);
    res.render("authors/new", {
      authorName: "",
      err: "Author's name is required!",
    });
  }
});
// Route for editing the author
router.get("/:id/edit", async (req, res) => {
  const { id } = req.params;
  const authorToEdit = await Author.findById(id);
  const { _id, name } = authorToEdit;
  res.render("authors/edit", { authorId: _id, authorName: name });
});

router.put("/", async (req, res) => {
  const { authorId, authorName } = req.body;
  try {
    await Author.findByIdAndUpdate(authorId, { name: authorName });
    res.redirect("authors");
  } catch (error) {
    console.log(error);
    res.render("authors/edit", { authorId, authorName });
  }
});

// route for deleting the authors, using "method-override library on front-end since Delete request can't be send through HTML"
router.delete("/", async (req, res) => {
  const nameToDelete = req.body.authorName;
  const author = await Author.deleteOne({ name: nameToDelete });
  const data = await Author.find({});
  const authors = data.map((datum) => datum.name);
  res.render("authors", { data: authors, inputQuery: null });
});

module.exports = router;
