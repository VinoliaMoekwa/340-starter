/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
const express = require("express")
const app = express()
const env = require("dotenv").config()
const static = require("./routes/static")
const expressEjsLayouts = require("express-ejs-layouts")
const path = require("path");

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
//app.use(expressEjsLayouts)
//app.set("layout", "/layouts/layout")// not at views root

/* ***********************
 * Require Statements
 *************************/



/* ***********************
 * Routes
 *************************/
//app.use(static)
app.use(express.static(path.join(__dirname, 'public')));


/* Index route */
app.get("/", function (req, res){ res.render("index", {title: "Home"})})



/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
