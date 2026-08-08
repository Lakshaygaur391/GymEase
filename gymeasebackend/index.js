require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

const PORT = process.env.PORT || 8000;

// CORS
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://gym-ease-git-main-procoders4.vercel.app'
  ],
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());

// MongoDB connection
const connectDB = require('./Databaseconnections/conn');
// Routes
const gymroute = require('./Routes/gymroute');
const membershipRoute = require('./Routes/membershipRoute');
const memberRoute = require('./Routes/memberRoute');
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({
      message: 'Database connection failed'
    });
  }
});
app.use('/auth', gymroute);
app.use('/membership', membershipRoute);
app.use('/member', memberRoute);

// Test route
app.get('/', (req, res) => {
  res.json({
    message: 'GymEase Backend is running'
  });
});

// Database test route
app.get('/db-test', async (req, res) => {
  try {
    const mongoose = require('mongoose');

    res.json({
      readyState: mongoose.connection.readyState,
      message: 'Database status checked'
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// Start server locally
if (require.main === module) {
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`GymEase Backend listening at http://localhost:${PORT}`);
      });
    })
    .catch((error) => {
      console.error('Failed to start server:', error.message);
      process.exit(1);
    });
}

module.exports = app;

// Export for Vercel
module.exports = app;