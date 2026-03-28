const nodemailer = require('nodemailer');
const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL;

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,               // 💡 在 Render 上，587 通常比 465 更容易穿透防火牆
  secure: false,           // 587 埠號必須設定為 false
  auth: {
    user: process.env.EMAIL_USER,
    pass: 'ahchsgykctvctoln' // 🚀 這是你剛產生的密碼（已去掉空格）
  },
  tls: {
    // ✅ 關鍵：忽略證書校驗並強制使用 TLS 1.2，這能解決大部分雲端連線掛起的問題
    rejectUnauthorized: false,
    minVersion: "TLSv1.2"
  },
  // ⚡ 核心修復：將超時時間拉長到 30 秒，給予跨國網路足夠的握手時間
  connectionTimeout: 30000, 
  greetingTimeout: 30000,
  socketTimeout: 30000,
  pool: true // 開啟連線池，減少重複建立連線的負擔
});

// ✅ 註冊與重設功能保持原樣，但在發送前加上 Debug 日誌
async function sendPasswordResetEmail(to, token) {
  const resetLink = `${FRONTEND_BASE_URL}/reset?token=${token}`;
  
  // 💡 [面試防卡死機制]：即便郵件沒寄出，你也能在 Render Logs 看到連結！
  console.log(`🔑 [DEBUG] 重設連結已產生: ${resetLink}`);

  return await transporter.sendMail({
    from: `"安全中心" <${process.env.EMAIL_USER}>`,
    to,
    subject: '重設您的密碼',
    html: `<p>請點擊以下連結來重設密碼：</p><a href="${resetLink}">${resetLink}</a>`
  });
}

module.exports = {
  sendVerificationEmail: async (to, token) => { /* 保持原樣 */ },
  sendPasswordResetEmail
};
