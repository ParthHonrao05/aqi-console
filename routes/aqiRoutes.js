const express = require('express');
const router = express.Router();
const { getAqiHistoryByDevice, deleteAqiReading } = require('../controllers/aqiController');

// GET AQI history of a device
router.get('/:deviceId', getAqiHistoryByDevice);
router.delete("/:readingId", deleteAqiReading);

module.exports = router;
