const nodemailer = require('nodemailer');
const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL;

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// ✅ 註冊信箱驗證
async function sendVerificationEmail(to, token) {
  const verificationLink = `${FRONTEND_BASE_URL}/api/auth/verify?token=${token}`;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: '請驗證您的帳號',
    html: `<p>請點擊以下連結完成驗證：</p><a href="${verificationLink}">${verificationLink}</a>`
  });
}

// ✅ 密碼重設（正確版本，只留這個）
async function sendPasswordResetEmail(to, token) {
  const resetLink = `${FRONTEND_BASE_URL}/reset?token=${token}`;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: '重設您的密碼',
    html: `<p>請點擊以下連結來重設密碼：</p><a href="${resetLink}">${resetLink}</a>`
  });
}

// ✅ 匯出（只匯出這兩個）
module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail
};

