const mongoose = require('mongoose');

const aqiReadingSchema = new mongoose.Schema(
  {
    device: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Device',
      required: true,
    },
    serialNumber: {
      type: String,
      required: true,
    },
    imei: {
      type: String,
      required: true,
    },
    aqi: {
      type: Number,
      required: true,
    }
  },
  {
    timestamps: true, // createdAt & updatedAt auto
  }
);

module.exports = mongoose.model('AqiReading', aqiReadingSchema);
