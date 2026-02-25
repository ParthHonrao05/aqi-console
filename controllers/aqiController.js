const AqiReading = require('../models/AqiReading');
const Device = require('../models/Device');

exports.getAqiHistoryByDevice = async (req, res) => {
  try {
    const { deviceId } = req.params;

    const device = await Device.findById(deviceId);

    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    const readings = await AqiReading.find({ device: deviceId })
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({
      count: readings.length,
      readings,
      device,   // ✅ send device also
    });

  } catch (error) {
    console.error('AQI Fetch Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteAqiReading = async (req, res) => {
  try {
    const { readingId } = req.params;

    const reading = await AqiReading.findById(readingId);

    if (!reading) {
      return res.status(404).json({ message: "Reading not found" });
    }

    await reading.deleteOne();

    res.json({ message: "Reading deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

