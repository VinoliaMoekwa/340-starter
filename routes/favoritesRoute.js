const express = require("express");
const router = express.Router();

const favoritesController = require("../controllers/favoritesController");
const utilities = require("../utilities");

/* ***************************
 * Favorites Page (UI)
 * GET /favorites
 * ************************** */
router.get(
  "/",
  utilities.checkJWTToken,
  favoritesController.buildFavorites
);

/* ***************************
 * Toggle Favorite (AJAX from JS)
 * POST /favorites/toggle
 * ************************** */
router.post(
  "/toggle",
  utilities.checkJWTToken,
  favoritesController.toggleFavorite
);

/* ***************************
 * Remove Favorite (AJAX fallback / page button)
 * POST /favorites/remove
 * ************************** */
router.post(
  "/remove",
  utilities.checkJWTToken,
  favoritesController.removeFavorite
);

module.exports = router;