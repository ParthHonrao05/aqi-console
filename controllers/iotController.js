const Device = require('../models/Device');
const AqiReading = require('../models/AqiReading');

exports.receiveDeviceData = async (req, res) => {
  try {
    const { serialNumber, imei, pm25, pm10 } = req.body;

    if (!serialNumber || !imei) {
      return res.status(400).json({
        message: 'Invalid payload: serialNumber or imei missing',
      });
    }

    const device = await Device.findOne({
      serialNumber,
      imeiNumber: imei,
    });

    if (!device) {
      return res.status(404).json({
        message: 'Device not registered',
      });
    }

    await AqiReading.create({
        device: device._id,
        serialNumber,
        imei,
        pm25,
        pm10,
    });
    console.log('AQI saved to DB');

    console.log('AQI Data received:', {
      serialNumber,
      imei,
      pm25,
      pm10,
    });

    res.status(200).json({
      message: 'Data received successfully',
    });
  } catch (error) {
    console.error('IoT Error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
