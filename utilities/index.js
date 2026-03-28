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
  let grid = ""
     if(Array.isArray(data) && data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="/inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
       grid += '<a href="/inv/detail/' + vehicle.inv_id +'" title="View ' 
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
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* ****************************************
 * Build HTML for a single vehicle detail view
 **************************************** */
Util.buildVehicleDetail = async function (vehicle) {
  const priceFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  })
  const milesFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })
   const imagePath = vehicle.inv_image && String(vehicle.inv_image).trim().length > 0
    ? (String(vehicle.inv_image).startsWith('/') ? vehicle.inv_image : `/${vehicle.inv_image}`)
    : '/images/vehicles/no-image.png'

  const make = vehicle.inv_make || 'Unknown make'
  const model = vehicle.inv_model || 'Unknown model'
  const year = vehicle.inv_year || 'Unknown year'
  const color = vehicle.inv_color || 'Not listed'
  const description = vehicle.inv_description || 'No description provided.'
  const classificationName = vehicle.classification_name || 'Unclassified'
  return `
    <section class="vehicle-detail">
      <div class="vehicle-detail-grid">
       <img src="${imagePath}" alt="${make} ${model}" loading="lazy" />
          
        </div>
        <article class="vehicle-detail-info">
          <h2 class="vehicle-main">${year} ${make} ${model}</h2>
          <p class="vehicle-price"><strong>Price:</strong> ${priceFormatter.format(vehicle.inv_price || 0)}</p>
          <p class="vehicle-mileage"><strong>Mileage:</strong> ${milesFormatter.format(vehicle.inv_miles || 0)} miles</p>
          <p><strong>Color:</strong> ${color}</p>
          <p><strong>Classification:</strong> ${classificationName}</p>
          <p><strong>Description:</strong> ${description}</p>
          <ul class="vehicle-specs" aria-label="Vehicle quick specs">
            <li><strong>Make:</strong> ${make}</li>
            <li><strong>Model:</strong> ${model}</li>
            <li><strong>Year:</strong> ${year}</li>
          </ul>
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