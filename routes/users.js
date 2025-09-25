import express from 'express';
import axios from 'axios';
import authMiddleware from '../middleware/auth.js';
import ensureUser from "../middleware/ensureUser.js";


const router = express.Router();
import { User } from "../database/index.js";

// Get profile of authenticated user
// backend/routes/user.js
router.get("/me", authMiddleware, ensureUser, async (req, res) => {
  try {
    const email = req.query.email;

    if (!email) {
      return res.status(400).json({ message: "Email not provided" });
    }

    const user = await User.findOne({ email }).lean();

    if (!user) {
      console.log("DEBUG: no user found in Mongo for", email);
      return res.status(404).json({ message: "User not found" }); // ✅ must be 404
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error("GET /me error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/me", authMiddleware, async (req, res) => {
  try {
    const { email, firstName, lastName, jobTitle, phone } = req.body;

    if (!email || !firstName || !lastName || !jobTitle || !phone) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({
      email,
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