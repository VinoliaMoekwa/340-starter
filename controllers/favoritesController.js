const favoritesModel = require("../models/favorites-model");

/* ***************************
 * Toggle Favorite (Add / Remove)
 * Called by: /favorites/toggle
 * ************************** */
async function toggleFavorite(req, res) {
  try {
    const account_id = res.locals.accountData?.account_id;
    const { inv_id } = req.body;

    if (!account_id) {
      return res.json({
        success: false,
        message: "You must be logged in."
      });
    }

    // check if already favorited
    const existing = await favoritesModel.checkFavorite(account_id, inv_id);

    if (existing) {
      // remove it
      await favoritesModel.removeFavorite(account_id, inv_id);

      const count = await favoritesModel.countFavorites(account_id);

      return res.json({
        success: true,
        isFavorite: false,
        favoriteCount: count,
        message: "Removed from favorites"
      });
    } else {
      // add it
      await favoritesModel.addFavorite(account_id, inv_id);

      const count = await favoritesModel.countFavorites(account_id);

      return res.json({
        success: true,
        isFavorite: true,
        favoriteCount: count,
        message: "Added to favorites!"
      });
    }
  } catch (error) {
    console.error("toggleFavorite error:", error);
    return res.json({
      success: false,
      message: "Server error"
    });
  }
}

/* ***************************
 * Get Favorites Page
 * ************************** */
async function buildFavorites(req, res) {
  try {
    const account_id = res.locals.accountData?.account_id;

    if (!res.locals.loggedin) {
  req.flash("notice", "Please log in to view favorites")
  return res.redirect("/account/login?redirect=/favorites")
}

    const favorites = await favoritesModel.getFavoritesByAccount(account_id);
    const favoriteCount = await favoritesModel.countFavorites(account_id);

    res.render("favorites/index", {
      title: "My Favorites",
      favorites,
      favoriteCount
    });

  } catch (error) {
    console.error("buildFavorites error:", error);
    res.status(500).send("Server Error");
  }
}

/* ***************************
 * Remove Favorite (page fallback)
 * ************************** */
async function removeFavorite(req, res) {
  try {
    const account_id = res.locals.accountData?.account_id;
    const { inv_id } = req.body;

    await favoritesModel.removeFavorite(account_id, inv_id);

    const count = await favoritesModel.countFavorites(account_id);

    return res.json({
      success: true,
      favoriteCount: count,
      message: "Removed from favorites"
    });

  } catch (error) {
    console.error("removeFavorite error:", error);
    return res.json({
      success: false,
      message: "Could not remove favorite"
    });
  }
}

module.exports = {
  toggleFavorite,
  buildFavorites,
  removeFavorite
};