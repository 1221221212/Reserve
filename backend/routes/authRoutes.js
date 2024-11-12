// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// ユーザー登録ルート
router.post('/register', authController.register);

// ユーザーログインルート
router.post('/login', authController.login);

module.exports = router;
