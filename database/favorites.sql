'use strict';

const pool = require('../database/'); // adjust if your path differs

/**
 * Add a favorite
 */
async function addFavorite(account_id, inv_id) {
  const sql = `
    INSERT INTO favorites (account_id, inv_id)
    VALUES ($1, $2)
    ON CONFLICT (account_id, inv_id) DO NOTHING
    RETURNING *
  `;
  const result = await pool.query(sql, [account_id, inv_id]);
  return result.rows[0];
}

/**
 * Remove a favorite
 */
async function removeFavorite(account_id, inv_id) {
  const sql = `
    DELETE FROM favorites
    WHERE account_id = $1 AND inv_id = $2
    RETURNING *
  `;
  const result = await pool.query(sql, [account_id, inv_id]);
  return result.rowCount;
}

/**
 * Check if favorite exists
 */
async function checkFavorite(account_id, inv_id) {
  const sql = `
    SELECT * FROM favorites
    WHERE account_id = $1 AND inv_id = $2
  `;
  const result = await pool.query(sql, [account_id, inv_id]);
  return result.rows[0];
}

/**
 * Get all favorites for a user (with vehicle data)
 */
async function getFavoritesByAccount(account_id) {
  const sql = `
    SELECT i.*
    FROM favorites f
    JOIN inventory i ON f.inv_id = i.inv_id
    WHERE f.account_id = $1
    ORDER BY f.created_at DESC
  `;
  const result = await pool.query(sql, [account_id]);
  return result.rows;
}

/**
 * Count favorites for a user
 */
async function countFavorites(account_id) {
  const sql = `
    SELECT COUNT(*) FROM favorites
    WHERE account_id = $1
  `;
  const result = await pool.query(sql, [account_id]);
  return parseInt(result.rows[0].count);
}

module.exports = {
  addFavorite,
  removeFavorite,
  checkFavorite,
  getFavoritesByAccount,
  countFavorites
};