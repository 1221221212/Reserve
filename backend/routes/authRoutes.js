const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

// シンプルなログインエンドポイント
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // 仮のユーザー認証（後でDBに保存した認証情報を使用）
    if (username === 'admin' && password === 'password') {  // ユーザー名・パスワードを確認
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
        return res.json({ token });
    } else {
        res.status(401).json({ message: '認証に失敗しました。' });
    }
});

module.exports = router;
