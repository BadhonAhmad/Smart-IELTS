const express = require('express');
const router = express.Router();

// Import controller modules
const { exampleController, healthController } = require('../controllers/index');

// Import middleware
const { validateRequest, authMiddleware } = require('../middleware/index');

// API version
router.get('/', (req, res) => {
  res.json({
    message: 'Smart IELTS API v1.0.0',
    version: '1.0.0',
    endpoints: {
      health: '/health',
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