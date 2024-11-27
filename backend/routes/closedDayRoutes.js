const express = require('express');
const router = express.Router();
const {
    createClosedDay,
    getAllClosedDays,
    getClosedDaysInRange,
    checkClosedDay
} = require('../controllers/closedDayController');
const authenticateToken = require('../middleware/auth');

// 休業日作成
router.post('/', authenticateToken, createClosedDay);

// 休業日一覧
router.get('/',authenticateToken, getAllClosedDays);

// 指定期間の休業日
router.get('/range', getClosedDaysInRange);

// 特定の日付の休業日判定
router.get('/check', checkClosedDay);

module.exports = router;
