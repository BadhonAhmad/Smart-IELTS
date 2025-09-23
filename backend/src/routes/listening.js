const express = require('express');
const listeningController = require('../controllers/listeningController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Student routes
router.post('/generate', listeningController.generateExercise);
router.post('/submit', listeningController.submitAnswers);
router.get('/history', listeningController.getHistory);
router.get('/:exerciseId/conversation', listeningController.getConversationForTTS);

// Admin routes
router.get('/exercises', restrictTo('admin'), listeningController.getAllExercises);

module.exports = router;