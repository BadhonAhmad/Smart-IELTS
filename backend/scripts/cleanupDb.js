const mongoose = require('mongoose');
require('dotenv').config();

const cleanupOldIndexes = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    
    // Get all existing indexes
    const indexes = await usersCollection.indexes();
    console.log('Existing indexes:', indexes.map(i => ({ name: i.name, key: i.key })));
    
    // Try to drop the username index if it exists
    try {
      await usersCollection.dropIndex('username_1');
      console.log('✅ Dropped username_1 index');
    } catch (error) {
      if (error.code === 27) {
        console.log('⚠️ username_1 index does not exist (this is fine)');
      } else {
        console.log('Error dropping username index:', error.message);
      }
    }
    
    // Recreate the email index to ensure it's unique
    try {
      await usersCollection.createIndex({ email: 1 }, { unique: true });
      console.log('✅ Email index created/verified');
    } catch (error) {
      console.log('Email index might already exist:', error.message);
    }
    
    console.log('✅ Database cleanup completed');
    
  } catch (error) {
    console.error('❌ Database cleanup failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
};

// Run the cleanup
cleanupOldIndexes();