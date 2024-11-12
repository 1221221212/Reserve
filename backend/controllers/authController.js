// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.register = async (req, res) => {
    const { username, password, email, role } = req.body;

    try {
        // パスワードのハッシュ化
        const password_hash = await bcrypt.hash(password, 10);
        await User.create({ username, password_hash, email, role });
        res.status(201).json({ message: '登録に成功しました' });
    } catch (error) {
        res.status(500).json({ message: '登録に失敗しました', error });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findByUsername(username);
        if (!user) {
            return res.status(400).json({ message: 'ユーザー名またはパスワードが間違っています' });
        }

        // パスワードの確認
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'ユーザー名またはパスワードが間違っています' });
        }

        // JWTトークンの作成
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, message: 'ログイン成功' });
    } catch (error) {
        res.status(500).json({ message: 'ログインに失敗しました', error });
    }
};
