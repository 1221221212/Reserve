const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.get('/availability', async (req, res) => {
    const { date } = req.query; // クエリパラメータから日付を取得

    try {
        // 日付に対応するパターンIDを取得
        const [rows] = await db.promise().query(
            `SELECT pattern_id FROM daily_availability WHERE available_date = ? AND is_closed = 0`,
            [date]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: '予約可能な枠がありません。' });
        }

        const patternId = rows[0].pattern_id;

        // パターンIDに対応する予約枠を取得
        const [slots] = await db.promise().query(
            `SELECT * FROM reservation_slots WHERE pattern_id = ?`,
            [patternId]
        );

        res.json(slots);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

module.exports = router;