const express = require("express");
const Author = require("../models/author");
const router = express.Router();

// route to get authors from db and display them with the ability to search authors
router.get("/", async (req, res) => {
    const authorToFind = req.query.authorToFind;
    console.log("name to look for", authorToFind);
    const searchOptions = {}; // if no author is being looked for, all authors will be shown
    if (authorToFind !== null && authorToFind !== "") {
        searchOptions.name = new RegExp(authorToFind, "i");
    }
    const data = await Author.find(searchOptions);
    console.log("data from DB", data);
    const authors = data.map((datum) => datum.name);
    res.render("authors", { data: authors, inputQuery: authorToFind });
});

// route to the new author page

router.get("/new", (req, res) => {
    res.render("authors/new", { authorName: "Author's name here", err: null });
});

// route for creating new author
router.post("/", async (req, res) => {
    // console.log("POST => ", req);
    try {
        const authorName = req.body.authorName;
        const author = new Author({ name: authorName }); //creates new author using the declared Schema
        const authorExists = await Author.exists({ name: authorName }); // checking if author already exist in the database
        console.log(authorExists);

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

// route for deleting the authors, using a subroute since DELETE method  on '/' route doesn't exist apparently...
router.post("/delete", async (req, res) => {
    const nameToDelete = req.body.authorName;
    console.log("author to delete", nameToDelete);
    const author = await Author.deleteOne({ name: nameToDelete });
    const data = await Author.find({});
    const authors = data.map((datum) => datum.name);
    res.render("authors", { data: authors });
});
module.exports = router;