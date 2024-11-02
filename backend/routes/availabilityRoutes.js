const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/availabilityController');

// 日単位で空き状況を取得
router.get('/day', availabilityController.getDailyAvailability);

// 月単位で空き状況を取得
router.get('/month', availabilityController.getMonthlyAvailability);

//現在の予約人数を計算
router.get('/current-reservation-count', availabilityController.getCurrentReservationCount);

module.exports = router;
