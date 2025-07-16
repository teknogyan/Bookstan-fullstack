const express = require("express");
const router = express.Router();
router.get("/", (req, res) => {
  res.redirect("/books") //redirecting the homepage to 'book index' route
});

module.exports = router;
