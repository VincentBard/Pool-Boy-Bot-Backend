import express from 'express';
import axios from 'axios';
import authMiddleware from '../middleware/auth.js';
import ensureUser from "../middleware/ensureUser.js";


const router = express.Router();
import { User } from "../database/index.js";

// Get profile of authenticated user
router.get("/me", authMiddleware, ensureUser, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.auth?.["https://example.com/email"] });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;