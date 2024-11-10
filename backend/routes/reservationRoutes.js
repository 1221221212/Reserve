// routes/reservationRoutes.js

const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth'); // 認証用ミドルウェア
const reservationController = require('../controllers/reservationController');

// 予約作成エンドポイント
router.post('/create', reservationController.createReservation);

// 認証が必要な予約情報取得エンドポイント
router.get('/', authenticateToken, reservationController.getAllReservations);

module.exports = router;
