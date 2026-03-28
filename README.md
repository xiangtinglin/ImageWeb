# PR Agency Website (Full-Stack)

## 📌 專案簡介
本專案為一個全端「形象改造服務網站」，提供使用者從註冊、登入、預約到帳戶管理的一站式體驗。
系統採用 **React + Node.js + PostgreSQL（Supabase）** 架構，並整合 Email 驗證與密碼重設機制，具備完整的實務應用能力。
---

## 🌐 Deployment

* **Frontend:** Vercel
* **Backend:** Render
* **Database:** Supabase PostgreSQL

---

## 🎥 Demo Video

[Demo Video / 專案展示影片](https://sites.google.com/view/myweb-ersha/project/%E7%B6%B2%E7%AB%99%E7%B3%BB%E7%B5%B1-web-system)

---

## 🧱 Full-stack 系統架構圖

```text
[ User Browser ]
       │
       ▼
[ Frontend / Vercel ]
React + Vite + Tailwind CSS
- Home
- Login / Register
- Booking
- BookingList
- Reset Password
       │
       │  Axios / REST API
       ▼
[ Backend / Render ]
Node.js + Express
- Auth Routes
- Booking Routes
- JWT Authentication
- bcrypt Password Hashing
- Nodemailer Email Service
       │
       ├──────────────► [ Gmail SMTP ]
       │                  驗證信 / 重設密碼信
       │
       ▼
[ Database / Supabase ]
PostgreSQL
- users
- bookings
```

---

## 🔄 API Flow（簡單版）

### 1. 註冊流程

User → Frontend (Vercel) → Backend (Render) → Supabase
　　　　　　　　　　　　　　　　└→ 發送驗證信 (Gmail SMTP)

### 2. 登入流程

User → Frontend → Backend → Supabase → JWT Token → Frontend

### 3. 忘記密碼流程

User → Frontend → Backend → Supabase
　　　　　　　　　　　　　　　　└→ 發送重設密碼信 (Gmail SMTP)

### 4. 預約流程

User → Frontend → Backend → Supabase

---

## 🎯 架構設計重點

* **Frontend 與 Backend 分離部署**
* **Frontend 使用 Vercel**，適合 React / Vite 靜態網站
* **Backend 使用 Render**，提供 Express API
* **Supabase 提供 PostgreSQL 資料庫服務**
* **透過 REST API 串接前後端**
* **整合 Email 驗證與密碼重設機制**

---

## 🚀 技術亮點

* React + Vite 建立現代化前端介面
* Express 建立 RESTful API
* Supabase PostgreSQL 作為雲端資料庫
* JWT 驗證登入狀態
* bcrypt 保護密碼安全
* Nodemailer 實作驗證信與重設密碼流程
* Vercel + Render + Supabase 完整雲端部署
