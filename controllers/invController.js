const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  if (!data || !data.length) {
    return next({ status: 404, message: "No vehicles found for that classification." })
  }
  const grid = await utilities.buildClassificationGrid(data)
  const nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildVehicleDetailById = async function (req, res, next) {
  const invId = req.params.invId
  const vehicle = await invModel.getInventoryById(invId)
  if (!vehicle) {
    return next({ status: 404, message: "Vehicle not found." })
  }
  const detailHtml = await utilities.buildVehicleDetail(vehicle)
  const nav = await utilities.getNav()

  res.render("./inventory/detail", {
    title: `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`,
    nav,
    detail: detailHtml,
  })
}

invCont.throwIntentionalError = async function (req, res, next) {
  throw new Error("Intentional 500 Error generated from /inv/throw-error")
}

module.exports = invCont