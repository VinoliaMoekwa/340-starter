const invModel = require("../models/inventory-model")
const Util = {}

function buildNavList(classifications = []) {
const navItems = ['<ul>', '<li><a href="/" title="Home page">Home</a></li>']
  classifications.forEach((row) => {
    navItems.push("<li>")
    navItems.push( 
   '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
  )
  navItems.push("</li>")
})

navItems.push("</ul>")
  return navItems.join("")
}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  const fallbackClassifications = [
    { classification_id: 1, classification_name: "Custom" },
    { classification_id: 2, classification_name: "Sedan" },
    { classification_id: 3, classification_name: "SUV" },
    { classification_id: 4, classification_name: "Truck" },
  ]

  let data
  try {
    data = await invModel.getClassifications()
  } catch (error) {
    console.error("getNav error " + error)
  }

  const classifications =
    data && data.rows && data.rows.length > 0 ? data.rows : fallbackClassifications

  return buildNavList(classifications)
}
// Route to build inventory by classification view

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* ****************************************
 * Build HTML for a single vehicle detail view
 **************************************** */
Util.buildVehicleDetail = async function (vehicle) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  })
  const milesFormatter = new Intl.NumberFormat('en-US')

  return `
    <section class="vehicle-detail">
      <div class="vehicle-detail-grid">
        <div class="vehicle-detail-image">
          <img src="${vehicle.inv_image}" alt="${vehicle.inv_make} ${vehicle.inv_model}" />
        </div>
        <article class="vehicle-detail-info">
          <h1>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h1>
          <p class="vehicle-price">Price: ${formatter.format(vehicle.inv_price)}</p>
          <p class="vehicle-mileage">Mileage: ${milesFormatter.format(vehicle.inv_miles)} miles</p>
          <p class="vehicle-color">Color: ${vehicle.inv_color}</p>
          <p class="vehicle-classification">Classification: ${vehicle.classification_name}</p>
          <p class="vehicle-description">${vehicle.inv_description}</p>
        </article>
      </div>
    </section>
  `
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
module.exports = Util