const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();

router.get("/signup", (req, res) => {
  console.log(req.cookies);
  res.render("auth/signup");
});

router.post("/signup", async (req, res) => {
  const { username, email } = req.body;
  let { password } = req.body;
  const salt = await bcrypt.genSalt();
  password = await bcrypt.hash(password, salt);
  console.log(username, email, password);
  const user = new User({
    username,
    email,
    password,
  });
  try {
    // await user.save();
    res.cookie("newCookie", 5000, { httpOnly: true, maxAge: 10000 });
    res.render("auth/login", {message: "Your account has been created, please log in!"});
  } catch (error) {
    console.log(error);
  }
});

router.get("/login", (req, res) => {
  res.render("auth/login", {message: null});
});

module.exports = router;
