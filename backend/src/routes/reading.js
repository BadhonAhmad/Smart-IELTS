const express = require('express');
const {
  generateReadingTest,
  getAllReadingTests,
  getReadingTestById,
  submitReadingTest,
  getUserAttempts
} = require('../controllers/readingController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Generate a complete reading test with passage and MCQs
router.post('/generate-test', generateReadingTest);

// Get all reading tests (with filtering and pagination)
router.get('/tests', getAllReadingTests);

// Get a specific reading test by ID
router.get('/tests/:id', getReadingTestById);

// Submit reading test attempt (requires authentication)
router.post('/submit/:testId', protect, submitReadingTest);

// Get user's reading test attempts (requires authentication)
router.get('/my-attempts', protect, getUserAttempts);

module.exports = router;