/**
 * Test setup and configuration
 */

const request = require('supertest');
const app = require('../src/app');

// Test database setup (if using database)
beforeAll(async () => {
  // Setup test database connection
  // await connectTestDB();
});

afterAll(async () => {
  // Clean up test database
  // await disconnectTestDB();
});

beforeEach(async () => {
  // Clean up test data before each test
  // await cleanupTestData();
});

afterEach(async () => {
  // Additional cleanup after each test if needed
});

module.exports = {
  app,
  request: request(app)
};