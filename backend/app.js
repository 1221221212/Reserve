const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const authenticateToken = require('./middleware/auth');

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

const availabilityRoutes = require('./routes/availabilityRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const authRoutes = require('./routes/authRoutes');
const patternRoutes = require('./routes/patternRoutes');
const assignedSlotsRoutes = require('./routes/assignedSlotsRoutes');
const holidayRoutes = require('./routes/holidayRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const closedDayRoutes = require('./routes/closedDayRoutes')

app.use('/auth', authRoutes); // 認証関連

// 認証不要のエンドポイント
app.use('/availability', availabilityRoutes);
app.use('/reservations', reservationRoutes);
app.use('/settings', settingsRoutes);
app.use('/holidays', holidayRoutes);
app.use('/closed-days', closedDayRoutes);

// 認証が必要なエンドポイント
app.use('/patterns', authenticateToken, patternRoutes);
app.use('/assigned-slots', authenticateToken, assignedSlotsRoutes);

require('dotenv').config(); // 環境変数を読み込む

// 環境変数からポートを取得（デフォルトは 3001）
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`サーバーがポート ${PORT} で起動しました`);
});
