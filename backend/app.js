const express = require('express');
const cors = require('cors');
const authenticateToken = require('./middleware/auth'); // 認証ミドルウェア
const app = express();

// CORSの適用（この部分でoriginを指定）
app.use(cors({ origin: 'http://localhost:3001' }));
app.use(express.json()); // JSONボディを解析

// ルートのインポート
const availabilityRoutes = require('./routes/availabilityRoutes');  // Availabilityルート
const reservationRoutes = require('./routes/reservationRoutes');    // Reservationルート
const authRoutes = require('./routes/authRoutes');                  // 認証ルート

// 各ルートの設定
app.use('/api/auth', authRoutes);               // 認証エンドポイント
app.use('/api', availabilityRoutes);            // Availabilityエンドポイント
app.use('/api', authenticateToken, reservationRoutes); // Reservationエンドポイントに認証を適用

app.listen(3000, () => {
    console.log('サーバーがポート3000で起動しました');
});
