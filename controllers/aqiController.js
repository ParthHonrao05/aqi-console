const AqiReading = require('../models/AqiReading');

exports.getAqiHistoryByDevice = async (req, res) => {
  try {
    const { deviceId } = req.params;

    const readings = await AqiReading.find({ device: deviceId })
      .sort({ createdAt: -1 }) // latest first
      .limit(100); // last 100 readings

    res.status(200).json({
      count: readings.length,
      readings,
    });
  } catch (error) {
    console.error('❌ AQI Fetch Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
