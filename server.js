<<<<<<< HEAD
/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/

const session = require("express-session")
const expressLayouts = require("express-ejs-layouts")
=======
const cookieParser = require("cookie-parser")
>>>>>>> c6a3cbed38cad63689bf25f3f4da76b27766b89d
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const dotenv = require("dotenv").config()
const app = express()
const staticRoutes = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require("./utilities")
<<<<<<< HEAD
const accountRoute = require("./routes/accountRoute")

=======
const session = require("express-session")
const flash = require("connect-flash")
const accountRoute = require("./routes/accountRoute")
>>>>>>> c6a3cbed38cad63689bf25f3f4da76b27766b89d


/* ***********************
 * Middleware
<<<<<<< HEAD
 * ************************/
 app.use(express.json())
 app.use(express.urlencoded({ extended: true}))
 app.use(express.static("public"))
=======
 *************************/
app.use(cookieParser())
app.use(session({
  secret: process.env.SESSION_SECRET || 'fortress_of_solitude',
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

app.use(utilities.checkJWTToken)

// Messages Middleware
app.use(flash())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
>>>>>>> c6a3cbed38cad63689bf25f3f4da76b27766b89d

/* ***********************
 * View Engine
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Routes
 *************************/
app.get("/", utilities.handleErrors(baseController.buildHome))
app.use("/inv", inventoryRoute)
app.use(staticRoutes)
app.use("/account", accountRoute)

// 404 handler
<<<<<<< HEAD
app.use(async(req, res, next) => {
=======
app.use(async (req, res, next) => {
>>>>>>> c6a3cbed38cad63689bf25f3f4da76b27766b89d
  next({ status: 404, message: "Sorry, we appear to have lost that page." })
})

/* ***********************
 * Global Error Handler
 *************************/
app.use(async (err, req, res, next) => {
  const nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  const message = err.status === 404 ? err.message : "Oh no! There was a crash."
  res.status(err.status || 500).render("errors/error", {
    title: err.status || "500",
    message,
    nav
  })
})

<<<<<<< HEAD
/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

=======
const port = process.env.PORT
const host = process.env.HOST
>>>>>>> c6a3cbed38cad63689bf25f3f4da76b27766b89d

app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})