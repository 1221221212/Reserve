// backend/routes/assignedSlotsRoutes.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const assignedSlotsController = require('../controllers/assignedSlotsController');

router.get('/assigned-slots', authenticateToken, assignedSlotsController.getAssignedSlots);
router.post('/assigned-slots', authenticateToken, assignedSlotsController.createAssignedSlot);

module.exports = router;