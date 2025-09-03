const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:Cyndyy888@db.odphctieejfnaoanoyes.supabase.co:5432/postgres'
});

async function testConnection() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('✅ 成功連線 Supabase：', res.rows[0]);
  } catch (err) {
    console.error('❌ 連線失敗：', err);
  } finally {
    await pool.end();
  }
}

testConnection();
