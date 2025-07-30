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
  password = await encryptPass(password);
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
  console.log(jwt.verify(req.cookies.jwtCookie, process.env.JWT_SECRET))
});

router.post("/login", async (req, res) => {
  const {email} = req.body;
  let password = req.body.password;

  console.log(password);

  const {user, isValidUser} = await validateUser(email, password)
  if (isValidUser) { 
    const cookie = createCookie(user.id);
    res.cookie("jwtCookie", cookie, {
      httpOnly: true,
      maxAge: 8 * 60 * 60 * 1000,
    });
    res.redirect("/")
  } else res.render("auth/login", {message: "Incorrect Credentials, Please try again"})
})


// Encryps password using 'bcrypt'
const encryptPass = async (password) => {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(password, salt);
}


// Recieves input by user and compares password, return a boolean and the user associated with the credentials
const validateUser = async(email, password) => {
  const user = await User.findOne({email});
  const isValidUser =  await bcrypt.compare(password, user.password)
  return {user, isValidUser};
}

//Returns Tokens using given user id
const createCookie = (id) => {
  return jwt.sign(id, process.env.JWT_SECRET);
};

module.exports = router;
