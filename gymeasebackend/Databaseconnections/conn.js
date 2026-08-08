const mongoose = require('mongoose');

let isConnecting = null;

const connectDB = async () => {
    // Already connected
    if (mongoose.connection.readyState === 1) {
        return;
    }

    // Connection already in progress
    if (mongoose.connection.readyState === 2 && isConnecting) {
        await isConnecting;
        return;
    }

    isConnecting = mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000
    });

    try {
        await isConnecting;
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        throw error;
    } finally {
        isConnecting = null;
    }
};

module.exports = connectDB;