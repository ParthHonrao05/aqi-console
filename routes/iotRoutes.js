const express = require('express');
const router = express.Router();
const { receiveDeviceData } = require('../controllers/iotController');

// AWS IoT will hit this
router.post('/data', receiveDeviceData);

module.exports = router;
