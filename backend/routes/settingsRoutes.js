// src/routes/settingsRoutes.js
const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const authenticateToken = require('../middleware/auth'); // 認証ミドルウェアをインポート

// 設定情報取得エンドポイント (認証必須)
router.get('/', authenticateToken, settingsController.getSettings);

// 設定情報保存エンドポイント (認証必須)
router.post('/', authenticateToken, settingsController.saveSettings);

module.exports = router;
