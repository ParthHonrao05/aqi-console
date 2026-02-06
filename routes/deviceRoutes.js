const express = require('express');
const router = express.Router();
const { createDevice, getDevices } = require('../controllers/deviceController');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Register a new device
router.post('/', authenticate, requireAdmin, createDevice);

// List all registered devices
router.get('/', authenticate, getDevices);

module.exports = router;
