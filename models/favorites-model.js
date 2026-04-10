const pool = require("../database");

/* ***************************
 * Add favorite
 * ************************** */
async function addFavorite(account_id, inv_id) {
  const sql = `
    INSERT INTO public.favorites (account_id, inv_id)
    VALUES ($1, $2)
    ON CONFLICT (account_id, inv_id) DO NOTHING
    RETURNING *
  `;
  const data = await pool.query(sql, [account_id, inv_id]);
  return data.rows[0];
}

/* ***************************
 * Remove favorite
 * ************************** */
async function removeFavorite(account_id, inv_id) {
  const sql = `
    DELETE FROM public.favorites
    WHERE account_id = $1 AND inv_id = $2
    RETURNING *
  `;
  const data = await pool.query(sql, [account_id, inv_id]);
  return data.rowCount;
}

/* ***************************
 * Check favorite exists
 * ************************** */
async function checkFavorite(account_id, inv_id) {
  const sql = `
    SELECT * FROM public.favorites
    WHERE account_id = $1 AND inv_id = $2
  `;
  const data = await pool.query(sql, [account_id, inv_id]);
  return data.rows[0];
}

/* ***************************
 * Get favorites for user (with vehicle data)
 * ************************** */
async function getFavoritesByAccount(account_id) {
  const sql = `
    SELECT i.*
    FROM public.favorites f
    JOIN public.inventory i ON f.inv_id = i.inv_id
    WHERE f.account_id = $1
    ORDER BY f.created_at DESC
  `;
  const data = await pool.query(sql, [account_id]);
  return data.rows;
}

/* ***************************
 * Count favorites
 * ************************** */
async function countFavorites(account_id) {
  const sql = `
    SELECT COUNT(*) FROM public.favorites
    WHERE account_id = $1
  `;
  const data = await pool.query(sql, [account_id]);
  return parseInt(data.rows[0].count);
}

module.exports = {
  addFavorite,
  removeFavorite,
  checkFavorite,
  getFavoritesByAccount,
  countFavorites
};