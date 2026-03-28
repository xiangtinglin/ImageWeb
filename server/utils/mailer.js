const nodemailer = require('nodemailer');

// 取得環境變數
const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL || 'http://localhost:3000';
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

// 🚀 配置 SMTP 傳輸器 (針對 Render 網路環境優化)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,               // 使用 587 埠號通常比 465 更能穿透雲端防火牆
  secure: false,           // 587 埠號必須設定為 false
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD   // ⚠️ 請確保這是去掉空格後的 16 位 App Password
  },
  tls: {
    // ✅ 關鍵：忽略自簽名憑證錯誤，這是解決 ETIMEDOUT 的常見手段
    rejectUnauthorized: false,
    minVersion: "TLSv1.2"
  },
  // ⚡ 設定超時限制，防止前端一直 Loading
  connectionTimeout: 20000, 
  greetingTimeout: 20000,
  socketTimeout: 20000,
  pool: true               // 使用連線池提升發信效率
});

/**
 * ✅ 註冊信箱驗證
 */
async function sendVerificationEmail(to, token) {
  // 自動處理網址結尾斜線，避免出現 //api 的情況
  const cleanBaseUrl = FRONTEND_BASE_URL.replace(/\/$/, '');
  const verificationLink = `${cleanBaseUrl}/api/auth/verify?token=${token}`;
  
  console.log(`✉️ [DEBUG] 驗證連結已產生: ${verificationLink}`);

  return await transporter.sendMail({
    from: `"客服系統" <${EMAIL_USER}>`,
    to,
    subject: '請驗證您的帳號',
    html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
        <h2>歡迎加入 ImageWeb！</h2>
        <p>請點擊以下連結完成帳號驗證：</p>
        <a href="${verificationLink}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">點我驗證帳號</a>
        <p style="margin-top: 20px; color: #666; font-size: 12px;">若按鈕無效，請複製此連結：<br>${verificationLink}</p>
      </div>
    `
  });
}

/**
 * ✅ 密碼重設 (含雙斜線修復與 Debug Log)
 */
async function sendPasswordResetEmail(to, token) {
  // 🚀 修復雙斜線問題：如果網址結尾有 / 就刪除它
  const cleanBaseUrl = FRONTEND_BASE_URL.replace(/\/$/, '');
  const resetLink = `${cleanBaseUrl}/reset?token=${token}`;
  
  // 💡 [面試必殺技]：即便 Render 寄信超時，你也能在 Logs 直接看到連結手動重設！
  console.log(`🔑 [DEBUG] 重設連結已產生: ${resetLink}`);

  return await transporter.sendMail({
    from: `"安全中心" <${EMAIL_USER}>`,
    to,
    subject: '重設您的密碼',
    html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
        <h2>重設密碼請求</h2>
        <p>我們收到了您的密碼重設請求，請點擊下方按鈕進行重設：</p>
        <a href="${resetLink}" style="background: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">重設密碼</a>
        <p style="margin-top: 20px; color: #666; font-size: 12px;">連結將於一小時後失效。若非本人操作，請忽略此信。</p>
      </div>
    `
  });
}

// 匯出功能
module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail
};
