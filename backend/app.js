const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const authenticateToken = require('./middleware/auth');
const { initializeDB } = require('./models/db');  // db.js から initializeDB をインポート

(async () => {
    try {
        await initializeDB();  // DB接続の初期化
        console.log('DB初期化が完了しました');
    } catch (error) {
        console.error('DB初期化に失敗しました:', error);
        process.exit(1); // 初期化に失敗した場合、アプリを終了
    }
})();

app.use(cors({ origin: 'http://localhost:3001' }));
app.use(express.json());

const availabilityRoutes = require('./routes/availabilityRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const authRoutes = require('./routes/authRoutes');
const patternRoutes = require('./routes/patternRoutes');
const assignedSlotsRoutes = require('./routes/assignedSlotsRoutes');
const holidayRoutes = require('./routes/holidayRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const closedDayRoutes = require('./routes/closedDayRoutes');

app.use('/api/auth', authRoutes); // 認証関連

// 認証不要のエンドポイント
app.use('/api/availability', availabilityRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/holidays', holidayRoutes);
app.use('/api/closed-days', closedDayRoutes);

// 認証が必要なエンドポイント
app.use('/api/patterns', authenticateToken, patternRoutes);
app.use('/api/assigned-slots', authenticateToken, assignedSlotsRoutes);

app.listen(3000, () => {
    console.log('サーバーがポート3000で起動しました');
});
