const nodemailer = require('nodemailer');
const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL;

// 🚀 核心修復：使用 Port 465 並加入 TLS 容錯
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,               // 強制使用 SSL
  secure: true,            // 搭配 Port 465 必須為 true
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD // ⚠️ 請確認 Render 環境變數 Key 叫這個名字
  },
  tls: {
    // ✅ 解決 Render 與 Gmail 之間的驗證問題
    rejectUnauthorized: false
  },
  // ⚡ 防止前端一直 Loading 的關鍵：設定 10 秒超時
  connectionTimeout: 10000, 
  greetingTimeout: 10000,
  socketTimeout: 10000,
  pool: true // 使用連線池提升效率
});

// ✅ 註冊信箱驗證
async function sendVerificationEmail(to, token) {
  const verificationLink = `${FRONTEND_BASE_URL}/api/auth/verify?token=${token}`;
  return await transporter.sendMail({
    from: `"客服系統" <${process.env.EMAIL_USER}>`,
    to,
    subject: '請驗證您的帳號',
    html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
        <h2>歡迎加入！</h2>
        <p>請點擊以下連結完成驗證：</p>
        <a href="${verificationLink}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">點我驗證帳號</a>
        <p style="margin-top: 20px; color: #666;">若按鈕無效，請複製此連結：<br>${verificationLink}</p>
      </div>
    `
  });
}

// ✅ 密碼重設
async function sendPasswordResetEmail(to, token) {
  const resetLink = `${FRONTEND_BASE_URL}/reset?token=${token}`;
  return await transporter.sendMail({
    from: `"安全中心" <${process.env.EMAIL_USER}>`,
    to,
    subject: '重設您的密碼',
    html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
        <h2>重設密碼請求</h2>
        <p>我們收到了您的密碼重設請求，請點擊下方連結進行重設：</p>
        <a href="${resetLink}" style="background: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">重設密碼</a>
        <p style="margin-top: 20px; color: #666;">連結將於一小時後失效。若非本人操作，請忽略此信。</p>
      </div>
    `
  });
}

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail
};
