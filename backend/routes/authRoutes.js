// authRoutes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';
const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET || 'your_refresh_secret_key';

// 初回ログインエンドポイント
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'password') {
        const accessToken = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ username }, REFRESH_SECRET_KEY, { expiresIn: '7d' });
        res.json({ accessToken, refreshToken });
    } else {
        res.status(401).json({ message: '認証に失敗しました。' });
    }
});

// リフレッシュトークンによるトークン更新エンドポイント
router.post('/refresh', (req, res) => {
    const { token: refreshToken } = req.body;

    if (!refreshToken) return res.sendStatus(401);

    jwt.verify(refreshToken, REFRESH_SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);

        const accessToken = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ accessToken });
    });
});

module.exports = router;
