const utilities = require('../utilities/');
const baseController = {};

baseController.BuildHome = async (req, res, next) => {
   const nav = await utilities.getNav();
    res.render("index", {title: "Home", nav});
}

module.exports = baseController;