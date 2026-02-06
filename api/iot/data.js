import mongoose from 'mongoose';
import Device from '../../models/Device.js';

// MongoDB connection (serverless)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
    }).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { serialNumber, imei, pm25, pm10 } = req.body;

    if (!serialNumber || !imei) {
      return res.status(400).json({ message: 'Invalid payload' });
    }

    const device = await Device.findOne({
      serialNumber,
      imeiNumber: imei,
    });

    if (!device) {
      return res.status(404).json({ message: 'Device not registered' });
    }

    console.log('📡 AQI Data:', { serialNumber, pm25, pm10 });

    return res.status(200).json({ message: 'Data received' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}
