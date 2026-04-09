const utilities = require('../utilities/');
const baseController = {};

baseController.BuildHome = async function (req, res) {
   const nav = await utilities.getNav();
    res.render("index", {title: "Home", nav});
}

baseController.triggerError = async function (req, res, next){
    throw new Error("International 500 error triggered for testing")
}

module.exports = baseController;