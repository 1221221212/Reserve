// src/routes/patternRoutes.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth'); // 認証用ミドルウェア
const patternModel = require('../models/patternModel'); // DB操作をモデルで処理

// 予約パターンの保存エンドポイント
router.post('/patterns', authenticateToken, async (req, res) => {
    const { pattern_name, start_time, end_time, max_groups, max_people } = req.body;

    try {
        const newPattern = await patternModel.createPattern({
            pattern_name,
            start_time,
            end_time,
            max_groups,
            max_people,
        });
        res.status(201).json({ message: 'パターンが保存されました', pattern: newPattern });
    } catch (error) {
        res.status(500).json({ message: 'パターンの保存に失敗しました', error });
    }
});

// 予約パターンの取得エンドポイント
router.get('/patterns', authenticateToken, async (req, res) => {
    try {
        const patterns = await patternModel.getPatterns(); // 保存されたパターンを取得
        res.status(200).json(patterns);
    } catch (error) {
        res.status(500).json({ message: 'パターンの取得に失敗しました', error });
    }
});

module.exports = router;
