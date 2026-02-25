const Device = require('../models/Device');
const User = require('../models/User');
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
  try {
    if (req.user.role === "CLIENT") {
      const devices = await Device.find({
        assignedClient: req.user.id,
      });
      return res.json({ devices });
    }
    // ADMIN
    const devices = await Device.find()
      .populate("assignedClient", "companyName username email")
      .sort({ createdAt: -1 });

    res.json({ devices });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const assignDeviceToClient = async (req, res) => {
  try {
    const { deviceId, clientId } = req.params;

    const device = await Device.findById(deviceId);
    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    const client = await User.findById(clientId);
    if (!client || client.role !== "CLIENT") {
      return res.status(404).json({ message: "Client not found" });
    }

    device.assignedClient = clientId;
    await device.save();

    res.json({
      message: "Device assigned successfully",
      device,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const toggleDeviceStatus = async (req, res) => {
  try {
    const device = await Device.findById(req.params.deviceId);
    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    device.status = device.status === "ON" ? "OFF" : "ON";
    await device.save();

    res.json({ message: "Status updated", device });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const readDeviceStatus = async (req, res) => {
  try {
    const device = await Device.findById(req.params.deviceId);

    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    if (device.status === "OFF") {
      return res.status(400).json({ message: "Device is OFF" });
    }

    const payload = {
      targetDevice: device.serialNumber,
      command: "SEND_AQI",
    };

    mqttClient.publish(
      "aqi/devices/broadcast",
      JSON.stringify(payload)
    );

    res.json({ message: "Read request sent" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const totalDevices = await Device.countDocuments();
    const onlineDevices = await Device.countDocuments({ status: "ON" });
    const totalClients = await User.countDocuments({ role: "CLIENT" });

    res.json({
      totalDevices,
      onlineDevices,
      totalClients,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createDevice,
  getDevices,
  assignDeviceToClient,
  toggleDeviceStatus,
  readDeviceStatus,
  getDashboardStats,
};