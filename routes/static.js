const express = require("express")
const router = express.Router()
const utilities = require("../utilities/")
const baseController = require("../controllers/baseController")

// Static Routes
router.use(express.static("public"))
router.use("/css", express.static(__dirname + "public/css"))
router.use("/js", express.static(__dirname + "public/js"))
router.use("/images", express.static(__dirname + "public/images"))
<<<<<<< HEAD

// Task 3: Intentional 500 error route (router -> controller -> middleware)
router.get(
  "/trigger-error",
  utilities.handleErrors(baseController.triggerError)
)
=======

// Task 3: Intentional 500 error route (router -> controller -> middleware)
router.get(
  "/trigger-error",
  utilities.handleErrors(baseController.triggerError)
)

module.exports = router
>>>>>>> c6a3cbed38cad63689bf25f3f4da76b27766b89d

module.exports = router
