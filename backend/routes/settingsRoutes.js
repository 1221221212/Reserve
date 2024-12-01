const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const authenticateToken = require('../middleware/auth');

// 認証が必要なエンドポイント
router.get('/', authenticateToken, settingsController.getSettings);
router.post('/', authenticateToken, settingsController.saveSettings);
router.get('/public', settingsController.getPublicSettings);

module.exports = router;
