"use strict";

const express = require("express"),
  layouts = require("express-ejs-layouts"),
  app = express(),
  router = require("./routes/index"),
  morgan = require("morgan"),
  mongoose = require("mongoose"),
  /* this package helps to identify GET and POST requests to assist application with HTTP methods*/
  methodOverride = require("method-override"),
  passport = require("passport"),
  cookieParser = require("cookie-parser"),
  expressSession = require("express-session"),
  expressValidator = require("express-validator"),
  connectFlash = require("connect-flash"),
  User = require("./models/user");

if (process.env.NODE_ENV === "test")
  mongoose.connect("mongodb://localhost:27017/it_course_provider_test_db", {
    useNewUrlParser: true,
    useFindAndModify: false
  });
else
  mongoose.connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/it_course_provider",
    { useNewUrlParser: true, useFindAndModify: false }
  );
mongoose.set("useCreateIndex", true);
//assigning port 3001 for testing and 3000 for(production)
if (process.env.NODE_ENV === "test") app.set("port", 3001);
else app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");

app.use(
  methodOverride("_method", {
    methods: ["POST", "GET"]
  })
);

app.use(morgan("combined"));
app.use(layouts);

//serving static views
app.use(express.static("public"));
app.use(expressValidator());
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(express.json());

// configuring cookieParser with a secret key.
app.use(cookieParser("secretCourse12345"));
// configuring Express.js to use sessions.
app.use(
  expressSession({
    secret: "secretCourse12345",
    cookie: {
      maxAge: 4000000
    },
    resave: false,
    saveUninitialized: false
  })
);
app.use(connectFlash());

//configuring Express.js to initialize and use passport
app.use(passport.initialize());
//making passport to use sessions
app.use(passport.session());
//setting up default login strategy
passport.use(User.createStrategy());
/* setting up passport to compact, encrypt, and decrypt user data */
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Setting up the loggedIn variable to reflect passport login status
app.use((req, res, next) => {
  res.locals.loggedIn = req.isAuthenticated();
  //Setting up the currentUser variable to reflect a logged-in user
  res.locals.currentUser = req.user;
  res.locals.flashMessages = req.flash();
  next();
});

app.use("/", router);

const server = app.listen(app.get("port"), () => {
    console.log(`Server running at http://localhost:${app.get("port")}`);
  }),
  io = require("socket.io")(server),
  chatController = require("./controllers/chatController")(io);

module.exports = app;
