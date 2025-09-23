const express = require('express');
const questionController = require('../controllers/questionController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Admin only routes
router.post('/upload', restrictTo('admin'), questionController.uploadPDF);
router.get('/files', restrictTo('admin'), questionController.getUploadedFiles);
router.delete('/files/:id', restrictTo('admin'), questionController.deleteFile);
router.get('/files/:fileId/questions', restrictTo('admin'), questionController.getQuestionsFromFile);

// Routes accessible by both admin and students
router.get('/questions', questionController.getAllQuestions);

module.exports = router;