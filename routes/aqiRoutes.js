const express = require('express');
const router = express.Router();
const { getAqiHistoryByDevice } = require('../controllers/aqiController');

// GET AQI history of a device
router.get('/:deviceId', getAqiHistoryByDevice);

module.exports = router;
