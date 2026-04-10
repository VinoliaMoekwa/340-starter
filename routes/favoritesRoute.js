const express = require("express");
const router = express.Router();

const favoritesController = require("../controllers/favoritesController");

/* ***************************
 * Favorites Page (UI)
 * GET /favorites
 * ************************** */
router.get("/", favoritesController.buildFavorites);

/* ***************************
 * Toggle Favorite (AJAX from JS)
 * POST /favorites/toggle
 * ************************** */
router.post("/toggle", favoritesController.toggleFavorite);

/* ***************************
 * Remove Favorite (AJAX fallback / page button)
 * POST /favorites/remove
 * ************************** */
router.post("/remove", favoritesController.removeFavorite);

module.exports = router;