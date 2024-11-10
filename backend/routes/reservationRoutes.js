// routes/reservationRoutes.js

const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth'); // 認証用ミドルウェア
const reservationController = require('../controllers/reservationController');

// 予約作成エンドポイント
router.post('/create', reservationController.createReservation);

// 認証が必要な予約情報取得エンドポイント
router.get('/', authenticateToken, reservationController.getAllReservations);

// 予約情報を取得するエンドポイント (フィルター付き)
router.get('/filtered', reservationController.getFilteredReservations);

module.exports = router;
