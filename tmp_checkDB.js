const pool = require('./database');
(async ()=>{
  try {
    const res = await pool.query('SELECT * FROM public.classification ORDER BY classification_name');
    console.log('rows', res.rows);
  } catch (e) {
    console.error('err', e);
  } finally {
    await pool.end();
  }
})();