require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/error');

const app = express();
const PORT = process.env.PORT || 3000;
connectDB();

//Url allowed to make calls to this backend
const allowedOrigins = [
  'http://localhost:8080',
  'http://smart-garden.netlify.app',
  'https://smart-garden.netlify.app',
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
//ex: app.use('/api/user', userRoute)


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
