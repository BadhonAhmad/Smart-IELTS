/**
 * Database configuration and connection management
 */

// Uncomment below when using MongoDB with Mongoose
/*
const mongoose = require('mongoose');

const dbConfig = {
    url: process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-ielts',
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
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
*/

// Placeholder database configuration
// Remove this and uncomment above when ready to use MongoDB

const dbConfig = {
    // For SQL databases (PostgreSQL, MySQL, etc.)
    // host: process.env.DB_HOST || 'localhost',
    // port: process.env.DB_PORT || 5432,
    // database: process.env.DB_NAME || 'smart_ielts',
    // username: process.env.DB_USER || 'postgres',
    // password: process.env.DB_PASSWORD || '',
    
    // For MongoDB
    // uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-ielts',
    
    // For SQLite (development)
    // filename: process.env.DB_FILE || './database.sqlite'
};

const connectDB = async () => {
    try {
        console.log('📦 Database connection placeholder');
        console.log('💡 Configure your database in config/database.js');
        console.log('🔧 Available options: MongoDB, PostgreSQL, MySQL, SQLite');
        
        // TODO: Implement actual database connection
        return Promise.resolve();
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = {
    connectDB,
    dbConfig
};