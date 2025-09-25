import express from 'express';
import axios from 'axios';
import authMiddleware from '../middleware/auth.js';
import ensureUser from "../middleware/ensureUser.js";


const router = express.Router();
import { User } from "../database/index.js";

// Get profile of authenticated user
router.get("/me", authMiddleware, ensureUser, async (req, res) => {
  try {
    const email = req.auth?.email;  // ✅ simpler
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new user entry if one doesn’t exist
router.post("/me", authMiddleware, async (req, res) => {
  try {
    const email = req.auth?.email;  // ✅ use Auth0 email directly
    if (!email) {
      return res.status(400).json({ message: "No email claim in token" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const { firstName, lastName, jobTitle, phone } = req.body;

    if (!firstName || !lastName || !jobTitle || !phone) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newUser = new User({
      email,         // ✅ required
      firstName,
      lastName,
      jobTitle,
      phone,
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;