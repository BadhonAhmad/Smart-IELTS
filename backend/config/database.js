/**
 * Database configuration and connection management
 */

const mongoose = require('mongoose');

const dbConfig = {
    url: process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-ielts',
    options: {
        // Removed deprecated options: useNewUrlParser and useUnifiedTopology
        // These are defaults in MongoDB Driver 4.0.0+
    },
};

const connectDB = async () => {
    try {
        await mongoose.connect(dbConfig.url, dbConfig.options);
        console.log('📦 MongoDB connected successfully');
        console.log(`📍 Database: ${mongoose.connection.name}`);
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1);
    }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
    console.log('📦 MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
    console.error('📦 MongoDB error:', err);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('📦 MongoDB connection closed through app termination');
    process.exit(0);
});

module.exports = {
    connectDB,
    mongoose
};