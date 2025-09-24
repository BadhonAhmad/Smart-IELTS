const express = require('express');
const multer = require('multer');
const { generateMCQ, generateIELTS, testGemini, generateReadingPassage, generateIELTSReadingPassage, generateFillBlank, generateMCQFromPassage, handleChat, analyzeWriting } = require('../controllers/geminiController');

const router = express.Router();

// Configure multer for image uploads (in memory storage for processing)
const imageUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Test endpoint
router.get('/test', testGemini);

// Generate general MCQ questions
router.post('/generate-mcq', generateMCQ);

// Generate IELTS skill-specific questions
router.post('/generate-ielts', generateIELTS);

// Generate reading passages
router.post('/generate-passage', generateReadingPassage);

// Generate IELTS themed passages
router.post('/generate-ielts-passage', generateIELTSReadingPassage);

// Generate fill-in-the-blank questions
router.post('/generate-fill-blank', generateFillBlank);

// Generate MCQ questions from a specific passage
router.post('/generate-mcq-from-passage', generateMCQFromPassage);

// Handle chat conversations
router.post('/chat', handleChat);

// Analyze writing image and provide IELTS scoring
router.post('/analyze-writing-image', imageUpload.single('image'), analyzeWriting);

module.exports = router;