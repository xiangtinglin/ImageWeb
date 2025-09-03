const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  if (!token) return res.status(401).json({ message: '缺少授權憑證' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'JWT 驗證失敗' });
    req.user = user;
    next();
  });
}

function isOverlappingBreakTime(start, end) {
  const breaks = [
    ['12:01', '12:59'],
    ['17:01', '18:59']
  ];
  return breaks.some(([bStart, bEnd]) => !(end <= bStart || start >= bEnd));
}
// 目標：確保後端預約儲存的日期為台灣時間（Asia/Taipei）
// ✅ 修改這一段後端 POST /api/booking 的處理：

const moment = require('moment-timezone'); // ⬅️ 新增這行：安裝 moment-timezone 套件

router.post('/', authenticateToken, async (req, res) => {
  const { service, date, start_time, end_time } = req.body;
  const email = req.user.email;
  
  // ✅ 先查詢是否已有完全相同的預約
  const existing = await db.query(
    `SELECT 1 FROM booking WHERE email = $1 AND date = $2 AND start_time = $3 AND end_time = $4 AND service = $5`,
    [email, date, start_time, end_time, service]
  );

  if (existing.rowCount > 0) {
    return res.status(400).json({ message: '您已預約此服務的同一時段，請勿重複預約' });
  }

  if (isOverlappingBreakTime(start_time, end_time)) {
    return res.status(400).json({ message: '無法跨越中午或晚間休息時段預約' });
  }

  try {
    // ✅ 轉換前端傳來的 date 為台北時間的日期格式（只保留 YYYY-MM-DD）
    const taipeiDate = moment.tz(`${date} 00:00:00`, 'Asia/Taipei').format('YYYY-MM-DD');
    // ✅ 檢查是否重複預約（同帳號、同日、同時段、同服務）
    const dup = await db.query(
      `SELECT * FROM booking 
       WHERE email = $1 AND date = $2 AND start_time = $3 AND end_time = $4 AND service = $5`,
      [email, date, start_time, end_time, service]
    );
    if (dup.rows.length > 0) {
      return res.status(400).json({ message: '您已預約此服務的同一時段，請勿重複預約' });
    }

    // 檢查是否已滿
    const result = await db.query(
      `SELECT COUNT(DISTINCT email) FROM booking WHERE date = $1 AND start_time = $2 AND end_time = $3`,
      [date, start_time, end_time]
    );
    const count = parseInt(result.rows[0].count, 10);
    if (count >= 5) {
      return res.status(400).json({ message: '此時段已滿，請選擇其他時間' });
    }

    // 寫入
    await db.query(
      `INSERT INTO booking (email, service, date, start_time, end_time)
       VALUES ($1, $2, $3, $4, $5)`,
      [email, service, date, start_time, end_time]
    );

    res.status(201).json({ message: '預約成功！' });
  } catch (err) {
    console.error('預約寫入錯誤:', err);
    res.status(500).json({ message: '伺服器錯誤' });
  }
});


router.get('/slots', authenticateToken, async (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ message: '缺少日期參數' });

  try {
    const allSlots = [
      ['10:00:00', '11:00:00'], ['11:00:00', '12:00:00'],
      ['13:00:00', '14:00:00'], ['14:00:00', '15:00:00'], ['15:00:00', '16:00:00'], ['16:00:00', '17:00:00'],
      ['19:00:00', '20:00:00'], ['20:00:00', '21:00:00'], ['21:00:00', '22:00:00']
    ];

    const result = await db.query(
      `SELECT start_time, end_time, COUNT(DISTINCT email) AS count
      FROM booking
      WHERE date = $1
      GROUP BY start_time, end_time`,
      [date]
    );


    const countMap = {};
    result.rows.forEach(row => {
      const key = `${row.start_time}-${row.end_time}`;
      countMap[key] = parseInt(row.count, 10);
    });

    const availableSlots = allSlots.map(([start, end]) => {
      const key = `${start}-${end}`;
      return {
        start_time: start,
        end_time: end,
        remaining: 5 - (countMap[key] || 0)
      };
    });

    res.json(availableSlots);
  } catch (err) {
    console.error('查詢可用時段失敗:', err);
    res.status(500).json({ message: '伺服器錯誤' });
  }
});

router.get('/', authenticateToken, async (req, res) => {
  const email = req.user.email;
  try {
    const result = await db.query(
      'SELECT * FROM booking WHERE email = $1 ORDER BY date ASC, start_time',
      [email]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('取得預約失敗:', err);
    res.status(500).json({ message: '伺服器錯誤' });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const email = req.user.email;
  try {
    const result = await db.query(
      'DELETE FROM booking WHERE id = $1 AND email = $2 RETURNING *',
      [id, email]
    );
    if (result.rowCount === 0) {
      return res.status(403).json({ message: '你沒有權限刪除這筆預約' });
    }
    res.json({ message: '已成功刪除預約' });
  } catch (err) {
    console.error('刪除預約錯誤:', err);
    res.status(500).json({ message: '伺服器錯誤' });
  }
});

module.exports = router;
