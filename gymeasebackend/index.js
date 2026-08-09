require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./Databaseconnections/conn');

const app = express();
const PORT = process.env.PORT || 8000;

// CORS configuration to allow local and any Vercel domain
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      origin.startsWith('http://localhost') ||
      origin.startsWith('http://127.0.0.1') ||
      origin.endsWith('.vercel.app')
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());

// Database connection middleware for Serverless
app.use(async (req, res, next) => {
  if (req.path === '/' || req.path === '/favicon.ico') {
    return next();
  }
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection failed:', error.message);
    return res.status(500).json({
      message: 'Database connection failed',
      error: error.message
    });
  }
});

const gymroute = require('./Routes/gymroute');
const membershipRoute = require('./Routes/membershipRoute');
const memberRoute = require('./Routes/memberRoute');

app.use('/auth', gymroute);
app.use('/membership', membershipRoute);
app.use('/member', memberRoute);

// Root health check route
app.get('/', (req, res) => {
  res.json({
    message: 'GymEase Backend is running successfully',
    status: 'online'
  });
});

// Database test route
app.get('/db-test', async (req, res) => {
  try {
    await connectDB();
    const mongoose = require('mongoose');
    res.json({
      readyState: mongoose.connection.readyState,
      message: 'Database connection is active'
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// Start server locally if run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`GymEase Backend listening at http://localhost:${PORT}`);
  });
}

module.exports = app;