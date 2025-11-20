import express from "express";
import Perimeter from "../database/perimeterSchema.js";
import Device from "../database/deviceSchema.js";
import authMiddleware from "../middleware/auth.js";
import ensureUser from "../middleware/ensureUser.js";

const router = express.Router();

/**
 * GET /api/perimeter/:deviceId
 * Returns both perimeters for a device.
 */
router.get("/:deviceId", authMiddleware, ensureUser, async (req, res) => {
  try {
    const { deviceId } = req.params;

    // Validate device belongs to user
    const device = await Device.findOne({
      _id: deviceId,
      owner: req.user.sub,
    });

    if (!device) {
      return res.status(404).json({ error: "Device not found or unauthorized" });
    }

    const perim = await Perimeter.findOne({ device: deviceId });

    // If no record → return empty objects
    if (!perim) {
      return res.json({
        shallow: [],
        deep: []
      });
    }

    return res.json({
      shallow: perim.shallow || [],
      deep: perim.deep || []
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});


/**
 * PUT /api/perimeter/:deviceId
 * Saves both perimeters.
 */
router.put("/:deviceId", authMiddleware, ensureUser, async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { shallow, deep } = req.body;

    // Validate payload format
    if (!Array.isArray(shallow) || !Array.isArray(deep)) {
      return res.status(400).json({
        error: "Invalid perimeter format. Expected shallow[] and deep[].",
      });
    }

    // Validate device belongs to the user
    const device = await Device.findOne({
      _id: deviceId,
      owner: req.user.sub,
    });

    if (!device) {
      return res.status(404).json({ error: "Device not found or unauthorized" });
    }

    // Upsert the record
    const updated = await Perimeter.findOneAndUpdate(
      { device: deviceId },
      {
        shallow,
        deep,
        updatedAt: Date.now(),
      },
      { new: true, upsert: true }
    );

    return res.json({
      success: true,
      shallow: updated.shallow,
      deep: updated.deep,
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
