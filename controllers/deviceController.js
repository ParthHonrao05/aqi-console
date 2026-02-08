const Device = require('../models/Device');
const mqttClient = require("../aws/mqttClient");

// @desc    Create a new device (Admin only)
// @route   POST /api/devices
// @access  Private/Admin
const createDevice = async (req, res) => {
  try {
    const { serialNumber, imeiNumber } = req.body;

    if (!serialNumber || !imeiNumber) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const exists = await Device.findOne({
      $or: [{ serialNumber }, { imeiNumber }],
    });

    if (exists) {
      return res.status(400).json({ message: 'Device already exists' });
    }

    const device = await Device.create({ serialNumber, imeiNumber });
    const payload = {
      targetDevice: serialNumber,
      command: "DEVICE_REGISTERED",
    };
    mqttClient.publish(
      "aqi/devices/broadcast",
      JSON.stringify(payload), 
      (err) => {
        if (err) {
          console.error("MQTT publish failed:", err.message);
        } else {
          console.log(" MQTT message sent:", payload);
        }
      }
    );

    res.status(201).json({
      message: 'Device created successfully',
      device,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all devices (Admin) or devices assigned to current user (Client)
// @route   GET /api/devices
// @access  Private
const getDevices = async (req, res) => {
  const devices = await Device.find().sort({ createdAt: -1 });
  res.json({ devices });
};

module.exports = {
  createDevice,
  getDevices,
};