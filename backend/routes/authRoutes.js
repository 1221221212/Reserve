const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const SECRET_KEY = 'your_secret_key';

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // シンプルなユーザー認証の例
    if (username === 'admin' && password === 'password') {
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
        return res.json({ token });
    }

    res.status(401).json({ message: '認証に失敗しました。' });
});

module.exports = router;
