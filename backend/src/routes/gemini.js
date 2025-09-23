const express = require('express');
const { generateMCQ, generateIELTS, testGemini, generateReadingPassage, generateIELTSReadingPassage } = require('../controllers/geminiController');

const router = express.Router();

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

module.exports = router;