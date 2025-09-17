import express from "express";
import { SensorReading, Device, User } from "../database/index.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Get all readings for a device
router.get("/:deviceId", authMiddleware, async (req, res) => {
  try {
    const readings = await SensorReading.find({ deviceId: req.params.deviceId }).sort({ recordedAt: -1 });
    res.json(readings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new reading
router.post("/:deviceId", authMiddleware, async (req, res) => {
  try {
    const { temperature, chlorineLevel, turbidity } = req.body;
    const reading = await SensorReading.create({
      deviceId: req.params.deviceId,
      temperature,
      chlorineLevel,
      turbidity
    });
    res.status(201).json(reading);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
