const { Pool } = require('pg');
require('dotenv').config();

const options = {
  connectionString: process.env.DATABASE_URL,
};

if (process.env.NODE_ENV === 'development') {
  options.ssl = { rejectUnauthorized: false };
}

let pool = new Pool(options);

module.exports = {
  async query(text, params) {
    try {
      const res = await pool.query(text, params);
      return res;
    } catch (error) {
      console.error('error in query', { text });
      throw error;
    }
  },
};