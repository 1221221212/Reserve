// backend/routes/holidayRoutes.js
const express = require('express');
const router = express.Router();
const holidayController = require('../controllers/holidayController');

router.get('/', holidayController.getHolidays);

module.exports = router;
