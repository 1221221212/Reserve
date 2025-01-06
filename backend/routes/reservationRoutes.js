// routes/reservationRoutes.js

const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const reservationController = require('../controllers/reservationController');

// 予約可否確認のエンドポイント
router.post('/check-availability', reservationController.checkAvailability);

// 予約作成エンドポイント
router.post('/create', reservationController.createReservation);

// 認証が必要な予約情報取得エンドポイント
router.get('/', authenticateToken, reservationController.getAllReservations);

// 予約情報を取得するエンドポイント (フィルター付き)
router.get('/filtered', authenticateToken, reservationController.getFilteredReservations);

// 予約情報を取得するエンドポイント (フィルター付き)
router.get('/action-required', authenticateToken, reservationController.getActionRequiredReservations);

// 予約IDで予約情報を取得するエンドポイント
router.get('/:id', authenticateToken, reservationController.getReservationDetail);

// 管理者による予約キャンセルエンドポイント
router.patch('/:id/cancel', authenticateToken, reservationController.cancelReservation);

router.get('/month', authenticateToken, reservationController.getMonthlyReservationCounts);
router.get('/day', authenticateToken, reservationController.getDailyReservationCounts);

router.patch('/:id/toggle-action-required', authenticateToken, reservationController.toggleActionRequired);

module.exports = router;
