// src/routes/patternRoutes.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth'); // 認証用ミドルウェア
const patternController = require('../controllers/patternController'); // Controllerをインポート

// 予約パターンの保存エンドポイント
router.post('/', authenticateToken, patternController.createPattern);

// 予約パターンの取得エンドポイント
router.get('/', authenticateToken, patternController.getPatterns);

module.exports = router;
