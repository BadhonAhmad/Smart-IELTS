const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const questionRoutes = require('./questions');
const listeningRoutes = require('./listening');
const geminiRoutes = require('./gemini');
const readingRoutes = require('./reading');

// Import controller modules
const { exampleController, healthController } = require('../controllers/index');

// Import middleware
const { validateRequest, authMiddleware } = require('../middleware/index');

// Authentication routes
router.use('/auth', authRoutes);

// Question management routes
router.use('/questions', questionRoutes);

// Listening exercise routes
router.use('/listening', listeningRoutes);

// Gemini AI routes
router.use('/gemini', geminiRoutes);

// Reading test routes
router.use('/reading', readingRoutes);

// API version
router.get('/', (req, res) => {
  res.json({
    message: 'Smart IELTS API v1.0.0',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/auth',
      questions: '/questions',
      listening: '/listening',
      gemini: '/gemini',
      reading: '/reading',
      example: '/example'
    }
  });
});

// Health routes
router.get('/health', healthController);

// Example routes
router.get('/example', exampleController);

// Example protected route (uncomment when auth is implemented)
// router.get('/protected', authMiddleware, exampleController);

// Example route with validation (uncomment when validation is implemented)
// router.post('/example', validateRequest, exampleController);

module.exports = router;