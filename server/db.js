const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // 🚀 優化：增加連線池設定，適合 Render 這種動態環境
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  ssl: {
    // ✅ 這是解決 SELF_SIGNED_CERT_IN_CHAIN 的關鍵
    rejectUnauthorized: false, 
  },
});

// 測試連線是否成功
pool.connect((err, client, release) => {
  if (err) {
    return console.error('❌ 資料庫連線失敗:', err.stack);
  }
  console.log('✅ 資料庫連線成功');
  release();
});

module.exports = pool;
