// routes/reservationRoutes.js

const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

// 予約作成エンドポイント
router.post('/create', reservationController.createReservation);

module.exports = router;
