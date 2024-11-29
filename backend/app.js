const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const authenticateToken = require('./middleware/auth');
const { query } = require('./models/db');  // db.js の query をインポート

// サーバーの起動
const startServer = async () => {
    try {
        // サーバーの起動（先にポートをバインド）
        const port = process.env.PORT || 3000;  // Renderでは環境変数PORTを使用
        app.listen(port, async () => {
            console.log(`サーバーがポート${port}で起動しました`);

            try {
                // DB接続が正常か確認
                await query('SELECT 1');  
                console.log('DB初期化が完了しました');
            } catch (error) {
                console.error('DB初期化に失敗しました:', error);
                process.exit(1); // DB接続に失敗した場合、アプリを終了
            }
        });
    } catch (error) {
        console.error('サーバーの起動に失敗しました:', error);
        process.exit(1); // サーバー起動に失敗した場合、アプリを終了
    }
};

// 最初にサーバーを起動してからDB接続を確立
startServer();

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

// 認証関連
app.use('/api/auth', authRoutes);

// 認証不要のエンドポイント
app.use('/api/availability', availabilityRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/holidays', holidayRoutes);
app.use('/api/closed-days', closedDayRoutes);

// 認証が必要なエンドポイント
app.use('/api/patterns', authenticateToken, patternRoutes);
app.use('/api/assigned-slots', authenticateToken, assignedSlotsRoutes);
