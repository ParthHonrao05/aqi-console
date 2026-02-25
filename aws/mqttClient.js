const mqtt = require("mqtt");
const fs = require("fs");
const path = require("path");
const Device = require("../models/Device");
const AqiReading = require("../models/AqiReading");

const client = mqtt.connect({
  host: process.env.AWS_IOT_ENDPOINT || "a2ot7xevzwabiz-ats.iot.eu-north-1.amazonaws.com",
  port: 8883,
  protocol: "mqtts",
  key: fs.readFileSync(path.join(__dirname, "private.pem.key")),
  cert: fs.readFileSync(path.join(__dirname, "device.pem.crt")),
  ca: fs.readFileSync(path.join(__dirname, "AmazonRootCA1.pem")),
});

//CONNECT
client.on("connect", () => {
  console.log("Connected to AWS IoT MQTT");

  //Single Channel subscription
  client.subscribe("aqi/devices/broadcast", (err) => {
    if (err) {
      console.error("Subscribe error:", err);
    } else {
      console.log("Subscribed to topic: aqi/devices/broadcast");
    }
  });

  //Device Data Channel
  client.subscribe("aqi/devices/data", (err) => {
    if (err) {
      console.error("Subscribe error:", err);
    } else {
      console.log("Subscribed to topic: aqi/devices/data");
    }
  });
});

//MESSAGE LISTENER
client.on("message", async (topic, message) => {
  try {
    const payload = JSON.parse(message.toString());
    console.log(`MQTT message: ${topic} received for device ${payload.serialNumber || payload.targetDevice}`);

    // COMMAND CHANNEL (broadcast)
    if (topic === "aqi/devices/broadcast") {
      const { targetDevice, command } = payload;
      if (!targetDevice || !command) {
        console.log("Invalid command payload, ignoring");
        return;
      }
      const device = await Device.findOne({
        serialNumber: targetDevice,
      });
      if (!device) {
        console.log("No matching device found, ignoring message");
        return;
      }
      if (command === "SEND_AQI") {
        const device = await Device.findOne({ serialNumber: targetDevice });

        if (device.status === "OFF") {
          console.log("Device is OFF. Ignoring command.");
          return;
        }
        console.log(`Device ${targetDevice} instructed to send AQI data`);
        simulateDeviceResponse(targetDevice);
      }
    }

    // DATA CHANNEL (device → server) ///
    if (topic === "aqi/devices/data") {
      const { serialNumber, imei, aqi } = payload;
      const device = await Device.findOne({ serialNumber });
      if (!device) {
        console.log("Unknown device, ignoring AQI data");
        return;
      }
      const reading = await AqiReading.create({
        device: device._id,
        serialNumber,
        imei,
        aqi,
      });
      console.log("AQI saved via MQTT:", reading._id);
      if (global.io) {
        global.io.emit("newAQI", reading);
      }
    }
  } catch (err) {
    console.error("MQTT message handling error:", err.message);
  }
});


function simulateDeviceResponse(deviceSerial) {
  const payload = {
    serialNumber: deviceSerial,
    imei: "IMEI",
    aqi: Math.floor(Math.random() * 300) + 10,
    timestamp: new Date().toISOString(),
  };

  client.publish(
    "aqi/devices/data",
    JSON.stringify(payload),
    () => {
      console.log(
        `AQI DATA: Device=${payload.serialNumber} AQI=${payload.aqi} `
      );
    }
  );
}

module.exports = client;
module.exports.simulateDeviceResponse = simulateDeviceResponse;
