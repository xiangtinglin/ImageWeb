const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL; // 環境變數設定 API 基礎 URL

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const crypto = require('crypto');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/mailer');

// 註冊
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const existing = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: '此帳號已被註冊' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    await db.query(
      `INSERT INTO users (email, password, verification_token, is_verified)
       VALUES ($1, $2, $3, FALSE)`,
      [email, hashedPassword, verificationToken]
    );

    await sendVerificationEmail(email, verificationToken);
    res.status(201).json({ message: '註冊成功，請前往信箱完成驗證' });
  } catch (err) {
    console.error('註冊錯誤:', err);
    res.status(500).json({ message: '伺服器錯誤' });
  }
});

// ✅ 驗證信箱
router.get('/verify', async (req, res) => {
  const { token } = req.query;

  try {
    const result = await db.query(
      `UPDATE users
       SET is_verified = TRUE, verification_token = NULL
       WHERE verification_token = $1
       RETURNING email`,
      [token]
    );

    if (result.rowCount === 0) {
      return res.status(400).send('驗證失敗或連結已失效');
    }

    res.redirect(`${FRONTEND_BASE_URL}/login?verified=true`); // ✅ 導回前端
  } catch (err) {
    console.error('驗證錯誤:', err);
    res.status(500).send('伺服器錯誤');
  }
});


// ✅ 重新寄送驗證信
router.post('/resend', async (req, res) => {
  const { email } = req.body;

  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ message: '帳號不存在' });
    }

    if (user.is_verified) {
      return res.status(400).json({ message: '您已完成驗證，無需重送' });
    }

    const newToken = crypto.randomBytes(32).toString('hex');
    await db.query(
      'UPDATE users SET verification_token = $1 WHERE email = $2',
      [newToken, email]
    );

    await sendVerificationEmail(email, newToken);

    res.json({ message: '驗證信已重新寄出，請至信箱查收' });
  } catch (err) {
    console.error('重送驗證信錯誤:', err);
    res.status(500).json({ message: '伺服器錯誤' });
  }
});


// ✅ 登入
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ message: '帳號不存在' });
    }

    // ✅ 判斷是否驗證過
    if (!user.is_verified) {
      return res.status(403).json({ message: '請先完成 Email 驗證' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: '密碼錯誤' });
    }

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: '登入成功', token });
  } catch (err) {
    console.error('登入錯誤:', err);
    res.status(500).json({ message: '伺服器錯誤' });
  }
});

// ✅ 忘記密碼 - 發送重設連結
router.post('/forgot', async (req, res) => {
  const { email } = req.body;
  const token = crypto.randomBytes(32).toString('hex');

  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ message: '帳號不存在' });
    }

    // ✅ 將重設 token 存入資料庫（你可能需要先在 users 表新增 reset_token 欄位）
    await db.query(
      'UPDATE users SET reset_token = $1 WHERE email = $2',
      [token, email]
    );

    const resetLink = `${FRONTEND_BASE_URL}/reset?token=${token}`;
    await sendPasswordResetEmail(email, token); 
    
    res.json({ message: '重設密碼連結已寄出，請至信箱查收' });
  } catch (err) {
    console.error('忘記密碼錯誤:', err);
    res.status(500).json({ message: '伺服器錯誤' });
  }
});


// ✅ 重設密碼
router.post('/reset', async (req, res) => {
  const { token, password } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);
    const result = await db.query(
      `UPDATE users SET password = $1, reset_token = NULL WHERE reset_token = $2 RETURNING email`,
      [hashed, token]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({ message: '連結失效或已使用' });
    }

    res.json({ message: '密碼已成功重設，請重新登入' });
  } catch (err) {
    console.error('重設密碼錯誤:', err);
    res.status(500).json({ message: '伺服器錯誤' });
  }
});


module.exports = router;
