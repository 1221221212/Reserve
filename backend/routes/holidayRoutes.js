// backend/routes/holidayRoutes.js
const express = require('express');
const router = express.Router();
const holidayController = require('../controllers/holidayController');
const authenticateToken = require('../middleware/auth');

router.get('/holidays', authenticateToken, holidayController.getHolidays);

module.exports = router;
