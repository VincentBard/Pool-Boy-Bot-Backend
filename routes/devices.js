import express from "express";
import { Device, User } from "../database/index.js";
import authMiddleware from "../middleware/auth.js";
import ensureUser from "../middleware/ensureUser.js";

const router = express.Router();

// List devices for authenticated user
router.get("/", authMiddleware, ensureUser, async (req, res) => {
  try {
    const email = req.auth?.["https://example.com/email"];
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const devices = await Device.find({ userId: user._id });
    res.json(devices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Register new device
router.post("/", authMiddleware, ensureUser, async (req, res) => {
  try {
    const email = req.auth?.["https://example.com/email"];
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const device = await Device.create({
      userId: user._id,
      deviceName: req.body.deviceName,
      serialNumber: req.body.serialNumber
    });

    res.status(201).json(device);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
