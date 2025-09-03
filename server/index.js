require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const API_BASE = process.env.VITE_API_BASE_URL;

// ✅ 用環境變數，不寫死
const PORT = process.env.PORT || 3001;

const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/booking');

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/booking', bookingRoutes);

app.get('/', (req, res) => {
  res.send('後端 API 運作中！');
});

app.listen(PORT, () => {
  console.log(`✅ Server running on ${API_BASE}`);
});
