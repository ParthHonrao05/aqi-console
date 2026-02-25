const express = require('express');
const router = express.Router();
const { createDevice, getDevices, assignDeviceToClient, toggleDeviceStatus, readDeviceStatus, getDashboardStats } = require('../controllers/deviceController');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Register a new device
router.post('/', authenticate, requireAdmin, createDevice);
router.put("/:deviceId/assign/:clientId", authenticate, requireAdmin, assignDeviceToClient );
router.put("/:deviceId/status", authenticate, requireAdmin, toggleDeviceStatus);
router.get("/dashboard/stats", authenticate, requireAdmin, getDashboardStats);
router.post("/:deviceId/read", authenticate, requireAdmin, readDeviceStatus );



// List all registered devices
router.get('/', authenticate, getDevices);

module.exports = router;
