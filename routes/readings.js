import express from "express";
import Reading from "../database/sensorReadingsSchema.js";
import Device from "../database/deviceSchema.js";
import authMiddleware from "../middleware/auth.js";
import ensureUser from "../middleware/ensureUser.js";

const router = express.Router();

// 📌 GET all readings (only humans should do this)
router.get("/", authMiddleware, ensureUser, async (req, res, next) => {
  try {
    if (req.user.isMachine) {
      return res.status(403).json({ message: "Machines cannot fetch readings" });
    }

    const readings = await Reading.find().populate("device");
    res.json(readings);
  } catch (err) {
    next(err);
  }
});
// 📌 GET all readings for a specific device
router.get("/device/:deviceId", authMiddleware, ensureUser, async (req, res, next) => {
  try {
    if (req.user.isMachine) {
      return res.status(403).json({ message: "Machines cannot fetch readings" });
    }

    const { deviceId } = req.params;

    const device = await Device.findById(deviceId);
    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    const readings = await Reading.find({ device: deviceId })
      .sort({ createdAt: -1 }) // newest first
      .populate("device");

    res.json(readings);
  } catch (err) {
    next(err);
  }
});

// 📌 GET the latest reading for a specific device
router.get("/device/:deviceId/latest", authMiddleware, ensureUser, async (req, res, next) => {
  try {
    if (req.user.isMachine) {
      return res.status(403).json({ message: "Machines cannot fetch readings" });
    }

    const { deviceId } = req.params;

    const device = await Device.findById(deviceId);
    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    const latestReading = await Reading.findOne({ device: deviceId })
      .sort({ createdAt: -1 }) // only latest
      .populate("device");

    if (!latestReading) {
      return res.status(404).json({ message: "No readings found for this device" });
    }

    res.json(latestReading);
  } catch (err) {
    next(err);
  }
});

// 📌 POST a new reading (machines or humans can do this)
router.post("/", authMiddleware, ensureUser, async (req, res, next) => {
  try {
    const { deviceId, temperature, pH, chlorine } = req.body;

    if (!deviceId) {
      return res.status(400).json({ message: "deviceId is required" });
    }

    // Verify device exists
    const device = await Device.findById(deviceId);
    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    // Create reading
    const reading = new Reading({
      device: device._id,
      temperature,
      pH,
      tds,
      batteryVoltage,
      batteryPercentage,
      recordedBy: req.user.isMachine ? "machine" : req.user.email,
    });

    await reading.save();
    res.status(201).json(reading);
  } catch (err) {
    next(err);
  }
});

export default router;