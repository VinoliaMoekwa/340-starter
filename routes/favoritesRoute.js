const express = require("express");
const router = express.Router();

const favoritesController = require("../controllers/favoritesController");
const utilities = require("../utilities");

router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(favoritesController.buildFavorites)
);

router.post(
  "/toggle",
  utilities.checkLogin,
  utilities.handleErrors(favoritesController.toggleFavorite)
);

router.post(
  "/remove",
  utilities.checkLogin,
  utilities.handleErrors(favoritesController.removeFavorite)
);

module.exports = router;