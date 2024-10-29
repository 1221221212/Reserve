// middleware/auth.js
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);  // トークンがない場合は401エラー

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);  // トークンが無効な場合は403エラー
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
