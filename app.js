import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import connectDB from "./db.js";
import authMiddleware from "./middleware/auth.js";
import errorHandler from "./middleware/error.js";
const { AccessToken } = require("livekit-server-sdk");

// Import route modules
import userRoutes from "./routes/users.js";
import deviceRoutes from "./routes/devices.js";
import readingRoutes from "./routes/readings.js";
import alertRoutes from "./routes/alerts.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB(); // or replace with inline mongoose.connect() if you prefer

// CORS configuration
const allowedOrigins = [
  'http://localhost:8080',
  'http://pool-bot.netlify.app',
  'https://pool-bot.netlify.app',
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes (all routes should internally use authMiddleware where needed)
app.use("/api/users", userRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/readings", readingRoutes);
app.use("/api/alerts", alertRoutes);

app.get("/getToken", (req, res) => {
  const { identity, roomName } = req.query;

  const at = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
    identity: identity || "guest",
  });
  at.addGrant({
    roomJoin: true,
    room: roomName || "default",
    canPublish: true,
    canSubscribe: true,
  });

  res.json({ token: at.toJwt() });
});

// Global error handler
app.use(errorHandler);

// Start server only after DB is connected
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error("MongoDB connection error:", err));

export default app;
