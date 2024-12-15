// backend/routes/assignedSlotsRoutes.js

const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const assignedSlotsController = require('../controllers/assignedSlotsController');

router.get('/', authenticateToken, assignedSlotsController.getAssignedSlots);
router.post('/', authenticateToken, assignedSlotsController.createAssignedSlot);
router.put('/status', authenticateToken, assignedSlotsController.updateAssignedSlotsStatus);


module.exports = router;
