import express from "express";
import { Alert } from "../database/index.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Get alerts for a device
router.get("/:deviceId", authMiddleware, async (req, res) => {
  try {
    const alerts = await Alert.find({ deviceId: req.params.deviceId }).sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new alert
router.post("/:deviceId", authMiddleware, async (req, res) => {
  try {
    const { alertType, message, severity } = req.body;
    const alert = await Alert.create({
      deviceId: req.params.deviceId,
      alertType,
      message,
      severity
    });
    res.status(201).json(alert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark alert as resolved
router.patch("/:alertId/resolve", authMiddleware, async (req, res) => {
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