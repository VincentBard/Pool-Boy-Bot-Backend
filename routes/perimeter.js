import express from "express";
import Perimeter from "../database/perimeterSchema.js";
import Device from "../database/deviceSchema.js";
import authMiddleware from "../middleware/auth.js";
import ensureUser from "../middleware/ensureUser.js";

const router = express.Router();

/**
 * GET /api/perimeter/:deviceId
 * Returns the perimeter polygon for a given device.
 */
router.get("/:deviceId", authMiddleware, ensureUser, async (req, res) => {
  try {
    const { deviceId } = req.params;

    // Validate device exists + belongs to user
    const device = await Device.findOne({
      _id: deviceId,
      owner: req.user.sub
    });

    if (!device) {
      return res.status(404).json({ error: "Device not found or unauthorized" });
    }

    const perim = await Perimeter.findOne({ device: deviceId });

    if (!perim) {
      return res.json({ perimeter: [] });
    }

    return res.json({ perimeter: perim.points });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});



/**
 * PUT /api/perimeter/:deviceId
 * Saves or updates the perimeter polygon for a device.
 */
router.put("/:deviceId", authMiddleware, ensureUser, async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { perimeter } = req.body; // [{x,y}, ...]

    if (!Array.isArray(perimeter)) {
      return res.status(400).json({ error: "Invalid perimeter format" });
    }

    // Validate device belongs to the user
    const device = await Device.findOne({
      _id: deviceId,
      owner: req.user.sub
    });

    if (!device) {
      return res.status(404).json({ error: "Device not found or unauthorized" });
    }

    // Upsert the perimeter
    const updated = await Perimeter.findOneAndUpdate(
      { device: deviceId },

      {
        points: perimeter,
        updatedAt: Date.now()
      },

      { new: true, upsert: true }
    );

    return res.json({ success: true, perimeter: updated.points });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
