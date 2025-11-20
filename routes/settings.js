import express from "express";
import authMiddleware from "../middleware/auth.js";
import ensureUser from "../middleware/ensureUser.js";
import UserSettings from "../database/userSettingsSchema.js";

const router = express.Router();

router.get("/", authMiddleware, ensureUser, async (req, res) => {
  try {
    const userId = req.user.sub;

    let settings = await UserSettings.findOne({ userId });

    // Create default record if missing
    if (!settings) {
      settings = new UserSettings({ userId });
      await settings.save();
    }

    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/", authMiddleware, ensureUser, async (req, res) => {
  try {
    const userId = req.user.sub;
    const data = req.body;

    const updated = await UserSettings.findOneAndUpdate(
      { userId },
      { ...data, updatedAt: Date.now() },
      { new: true, upsert: true }
    );

    res.json({ success: true, settings: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
