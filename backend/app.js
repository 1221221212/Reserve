// app.js
const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const authenticateToken = require('./middleware/auth');

app.use(cors({ origin: 'http://localhost:3001' }));
app.use(express.json());

const availabilityRoutes = require('./routes/availabilityRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const authRoutes = require('./routes/authRoutes');
const patternRoutes = require('./routes/patternRoutes');
const assignedSlotsRoutes = require('./routes/assignedSlotsRoutes');
const holidayRoutes = require('./routes/holidayRoutes');
const settingsRoutes = require('./routes/settingsRoutes'); // 設定ルート

app.use('/api/auth', authRoutes); // 認証関連

// 認証が必要なエンドポイント
app.use('/api/patterns', authenticateToken, patternRoutes);
app.use('/api/assigned-slots', authenticateToken, assignedSlotsRoutes);
app.use('/api/settings', authenticateToken, settingsRoutes); // 設定エンドポイントも認証必須に設定

// 認証不要のエンドポイント
app.use('/api/availability', availabilityRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/holidays', holidayRoutes);

app.listen(3000, () => {
    console.log('サーバーがポート3000で起動しました');
});
