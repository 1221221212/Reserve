// app.js
require('dotenv').config(); // .envファイルから環境変数を読み込む
const express = require('express');
const cors = require('cors');
const authenticateToken = require('./middleware/auth');
const app = express();

// CORSの設定
app.use(cors({ origin: 'http://localhost:3001' }));
app.use(express.json()); // JSONボディを解析

// ルートのインポート
const availabilityRoutes = require('./routes/availabilityRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const authRoutes = require('./routes/authRoutes');
const patternRoutes = require('./routes/patternRoutes');
const holidayRoutes = require('./routes/holidayRoutes'); // 祝日取得のルートをインポート
const assignedSlotsRoutes = require('./routes/assignedSlotsRoutes');

// 各ルートの設定
app.use('/api/auth', authRoutes);
app.use('/api', authenticateToken, availabilityRoutes);
app.use('/api', authenticateToken, reservationRoutes);
app.use('/api', authenticateToken, patternRoutes);
app.use('/api', holidayRoutes); // 祝日取得のルートを追加
app.use('/api', authenticateToken, assignedSlotsRoutes);

// サーバー起動
app.listen(3000, () => {
    console.log('サーバーがポート3000で起動しました');
});
