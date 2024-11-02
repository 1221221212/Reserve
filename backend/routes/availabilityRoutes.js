const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/availabilityController');

// 日単位で空き状況を取得
router.get('/day', availabilityController.getDailyAvailability);

// 月単位で空き状況を取得
router.get('/month', availabilityController.getMonthlyAvailability);

module.exports = router;
