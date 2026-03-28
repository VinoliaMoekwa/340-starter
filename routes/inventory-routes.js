// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/inventory-controller")
const utilities = require("../utilities")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route to build a single vehicle detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildVehicleDetailById))

// Intentional error route for Task 3 footer test link
router.get("/throw-error", utilities.handleErrors(invController.throwIntentionalError))

module.exports = router