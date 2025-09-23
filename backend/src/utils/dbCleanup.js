const mongoose = require('mongoose');

const cleanupDatabase = async () => {
  try {
    const db = mongoose.connection.db;
    
    // Get the users collection
    const usersCollection = db.collection('users');
    
    // Get all existing indexes
    const indexes = await usersCollection.indexes();
    console.log('Existing indexes:', indexes);
    
    // Drop the problematic username index if it exists
    const usernameIndex = indexes.find(index => 
      index.key && index.key.username !== undefined
    );
    
    if (usernameIndex) {
      console.log('Found username index, dropping it...');
      await usersCollection.dropIndex('username_1');
      console.log('Username index dropped successfully');
    }
    
    // Ensure email index exists and is unique
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    console.log('Email index created/verified');
    
    console.log('Database cleanup completed successfully');
  } catch (error) {
    console.error('Database cleanup error:', error);
    // If index doesn't exist, that's fine
    if (error.code !== 27) { // 27 = IndexNotFound
      throw error;
    }
  }
};

const resetUserCollection = async () => {
  try {
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    
    // Drop the entire users collection to start fresh
    await usersCollection.drop();
    console.log('Users collection dropped');
    
    // The collection and indexes will be recreated when we insert the first user
    console.log('Database reset completed');
  } catch (error) {
    console.error('Database reset error:', error);
    // Collection might not exist, that's fine
    if (error.code !== 26) { // 26 = NamespaceNotFound
      throw error;
    }
  }
};

module.exports = {
  cleanupDatabase,
  resetUserCollection
};