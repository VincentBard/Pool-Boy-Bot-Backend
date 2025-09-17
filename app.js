import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./db.js";
import authMiddleware from "./middleware/auth.js";
import errorHandler from "./middleware/error.js";
import mongoose from "mongoose";

// Import route modules
import userRoutes from "./routes/users.js";
import deviceRoutes from "./routes/devices.js";
import readingRoutes from "./routes/readings.js";
import alertRoutes from "./routes/alerts.js";



const app = express();
const PORT = process.env.PORT || 3000;
connectDB();

//Url allowed to make calls to this backend
const allowedOrigins = [
  'http://localhost:8080',
  'http://pool-bot.netlify.app',
  'https://pool-bot.netlify.app',
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
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

//Add Routes Here***
app.use("/api/users", userRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/readings", readingRoutes);
app.use("/api/alerts", alertRoutes);
app.use(errorHandler);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 5000, () => console.log("Server running"));
  })
  .catch(err => console.error(err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
