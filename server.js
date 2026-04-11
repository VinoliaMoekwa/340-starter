const cookieParser = require("cookie-parser");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
require("dotenv").config();

const app = express();

const staticRoutes = require("./routes/static");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const utilities = require("./utilities");
const accountRoute = require("./routes/accountRoute");
const favoritesRoute = require("./routes/favoritesRoute");

const flash = require("connect-flash");
const session = require("express-session");

/* ***********************
 * Middleware
 *************************/

// Cookie parser (must be FIRST for JWT access)
app.use(cookieParser());

// Session (NOT used for auth, but harmless for flash)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "fortress_of_solitude",
    resave: false,
    saveUninitialized: false,
    name: "sessionId",
  })
);

// JWT middleware (FIXED SAFETY VERSION)
app.use(utilities.checkJWTToken);

// Flash messages
app.use(flash());

// Make flash messages available in views
app.use((req, res, next) => {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static("public"));

/* ***********************
 * View Engine
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

/* ***********************
 * Routes
 *************************/
app.get("/", utilities.handleErrors(baseController.buildHome));

app.use("/inv", inventoryRoute);
app.use(staticRoutes);
app.use("/account", accountRoute);
app.use("/favorites", favoritesRoute);

/* ***********************
 * 404 Handler
 *************************/
app.use((req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." });
});

/* ***********************
 * Global Error Handler
 *************************/
app.use(async (err, req, res, next) => {
  const nav = await utilities.getNav();

  console.error(`Error at: "${req.originalUrl}":`, err);

  const message =
    err.status === 404
      ? err.message
      : "Oh no! There was a crash.";

  res.status(err.status || 500).render("errors/error", {
    title: err.status || "500",
    message,
    nav,
  });
});

/* ***********************
 * Start Server
 *************************/
const port = process.env.PORT || 5500;
const host = "0.0.0.0";

app.listen(port, host, () => {
  console.log(`app listening on ${host}:${port}`);
});