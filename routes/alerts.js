import express from "express";
import { Alert } from "../database/index.js";
import authMiddleware from "../middleware/auth.js";
import ensureUser from "../middleware/ensureUser.js";
import Device from "../database/deviceSchema.js";

const router = express.Router();

// Get alerts for a device
router.get("/:deviceId", authMiddleware, ensureUser, async (req, res) => {
  try {
    const { deviceId } = req.params;

    // Last 24 hours threshold
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Delete alerts older than 24 hours
    await Alert.deleteMany({
      device: deviceId,
      createdAt: { $lt: oneDayAgo }
    });

    // Get alerts from past 24 hours
    const alerts = await Alert.find({
      device: deviceId,
      createdAt: { $gte: oneDayAgo }
    }).sort({ createdAt: -1 });

    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new alert
router.post("/:deviceId", authMiddleware, ensureUser, async (req, res, next) => {
  try {
    const { alertType, message, severity } = req.body;
    const { deviceId } = req.params;

    if (!deviceId) {
      return res.status(400).json({ message: "deviceId is required" });
    }

    // Verify device exists
    const device = await Device.findById(deviceId);
    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    // Create alert with "recordedBy" identical to reading logic
    const alert = new Alert({
      device: device._id,
      alertType,
      message,
      severity,
      recordedBy: req.user.isMachine ? "machine" : req.user.email,
    });

    await alert.save();
    res.status(201).json(alert);
  } catch (err) {
    next(err);
  }
});

// Mark alert as resolved
router.patch("/:alertId/resolve", authMiddleware, ensureUser, async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.alertId,
      { resolved: true },
      { new: true }
    );
    if (!alert) return res.status(404).json({ message: "Alert not found" });
    res.json(alert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;