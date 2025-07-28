const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();

router.get("/signup", (req, res) => {
  console.log(req.cookies);
  res.render("auth/signup", { message: null });
});

router.post("/signup", async (req, res) => {
  const { username, email } = req.body;
  let { password } = req.body;
  const salt = await bcrypt.genSalt();
  password = await bcrypt.hash(password, salt);
  console.log(username, email, password);
  if (
    (await User.exists({ username: username })) ||
    (await User.exists({ email: email }))
  ) {
    res.render("auth/signup", {
      message:
        "A user with this Username or Email already exists, try another one!",
    });
  } else {
    const user = new User({
      username,
      email,
      password,
    });

    try {
      await user.save();
      const cookie = createCookie(user.username);
      res.cookie("jwtCookie", cookie, {
        httpOnly: true,
        maxAge: 8 * 60 * 60 * 1000,
      });
      res.render("auth/login", {
        message: "Your account has been created, please log in!",
      });
    } catch (error) {
      console.log(error);
    }
  }
});

router.get("/login", (req, res) => {
  res.render("auth/login", { message: null });
});

const createCookie = (id) => {
  return jwt.sign(id, process.env.JWT_SECRET);
};

module.exports = router;
