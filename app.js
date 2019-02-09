const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const session = require("express-session");
const passport = require("passport");
const app = express();

// Load Keys for mongoose
const keys = require("./config/keys");
// Load exhbsHelpers
const exhbsHelpers = require("./helpers/exhbsHelpers");

// Load 'auth' Routes
const authRoutes = require("./routes/auth");
// Load '/' Routes
const indexRoutes = require("./routes/index");
// Load '/stories' Routes
const storiesRoutes = require("./routes/stories");

mongoose
  .connect(keys.mongoURI, { useNewUrlParser: true })
  .then(() => console.log("MongoDB is now connected..."))
  .catch(err => console.log(err));

// Express-Handlebars Middleware
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
    helpers: {
      stripTags: exhbsHelpers.stripTags,
      truncateString: exhbsHelpers.truncateString,
      formatDate: exhbsHelpers.formatDate,
      select: exhbsHelpers.select,
      compare: exhbsHelpers.compare
    }
  })
);
app.set("view engine", "handlebars");

// Body-Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Method-override Middlware
app.use(methodOverride("_method"));

// Public Dir Middlware
app.use(express.static(__dirname + "/public"));

// Express-Session Middleware
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true
  })
);

// Passport Middlware
app.use(passport.initialize());
app.use(passport.session());

// Global Variables
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// Routes
app.use("/auth", authRoutes);
app.use("/", indexRoutes);
app.use("/stories", storiesRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App is now listening to port ${port}`);
});
