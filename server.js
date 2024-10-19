const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const dotEnv = require("dotenv").config();

const mongoose = require("mongoose");

const PORT = process.env.PORT || 5000;

const indexRoute = require("./routes/index");
const authorsRoute = require("./routes/authors");
const booksRoute = require("./routes/books")

app.use(expressLayouts);

//templating engine setup
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", __dirname + "/views/layouts/layout");

//static assets
app.use(express.static(__dirname + "/public"));

// In the course the 'body-parser' library is used which comes bundled with express now, I guess.
app.use(express.urlencoded({ limit: "10mb", extended: false }));

const { collection } = require("./models/author");
const author = require("./models/author");

mongoose.connect(process.env.DATABASE_URL);

const dbConn = mongoose.connection;

dbConn.on("error", (error) => {
  console.error(error);
});

dbConn.once("open", () => {
  console.log("Connected to Mongoose");
});


//setting Routes
app.use("/", indexRoute);
app.use("/authors", authorsRoute);
app.use("/books", booksRoute);

app.listen(PORT, () => {
  console.log(`listening on the Port ${PORT}`);
});
