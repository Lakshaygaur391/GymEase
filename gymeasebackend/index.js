require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://gym-ease-bice.vercel.app/"
  ],
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());

// MongoDB connection
require('./Databaseconnections/conn');

// Routes
const gymroute = require('./Routes/gymroute');
const membershipRoute = require('./Routes/membershipRoute');
const memberRoute = require('./Routes/memberRoute');

app.use("/auth", gymroute);
app.use("/membership", membershipRoute);
app.use("/member", memberRoute);

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "GymEase Backend is running"
  });
});

module.exports = app;