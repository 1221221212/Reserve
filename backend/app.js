const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const authenticateToken = require('./middleware/auth');

// CORS設定
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// ルートのインポート
const availabilityRoutes = require('./routes/availabilityRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const authRoutes = require('./routes/authRoutes');
const patternRoutes = require('./routes/patternRoutes');
const assignedSlotsRoutes = require('./routes/assignedSlotsRoutes');
const holidayRoutes = require('./routes/holidayRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const closedDayRoutes = require('./routes/closedDayRoutes');
const commentRoutes = require('./routes/commentRoutes');

// APIルーターの設定
const apiRouter = express.Router();

// 認証不要のエンドポイント
apiRouter.use('/auth', authRoutes);
apiRouter.use('/availability', availabilityRoutes);
apiRouter.use('/reservations', reservationRoutes);
apiRouter.use('/settings', settingsRoutes);
apiRouter.use('/holidays', holidayRoutes);
apiRouter.use('/closed-days', closedDayRoutes);

// Test endpoint
apiRouter.get('/test', (req, res) => {
    res.json({ message: 'Test endpoint is working!' });
});

// 認証が必要なエンドポイント
apiRouter.use('/patterns', authenticateToken, patternRoutes);
apiRouter.use('/assigned-slots', authenticateToken, assignedSlotsRoutes);
apiRouter.use('/comment', authenticateToken, commentRoutes);

// 全てのエンドポイントに /api プレフィックスを追加
app.use('/api', apiRouter);

// サーバーの起動
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`サーバーがポート ${PORT} で起動しました`);
});
