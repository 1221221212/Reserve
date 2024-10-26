const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_secret_key';

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'トークンが必要です。' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'トークンが無効です。' });
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
