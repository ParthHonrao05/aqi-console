const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  serialNumber: {
    type: String,
    required: [true, 'Serial Number is required'],
    unique: true,
    trim: true,
    maxlength: [30, 'Serial Number must be upto 30 characters'],
    match: [/^[a-zA-Z0-9]+$/, 'Serial Number must be exactly 30 alphanumeric characters'],
  },
  imeiNumber: {
    type: String,
    required: [true, 'imei Number is required'],
    unique: true,
    length: 15
  },
  status: {
    type: String,
    enum: ["ON", "OFF"],
    default: "ON",
  },
  assignedClient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  }
}, {
  timestamps: true,
});

// Index for faster queries
deviceSchema.index({ assignedTo: 1 });

module.exports = mongoose.model('Device', deviceSchema);