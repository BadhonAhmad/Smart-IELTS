/**
 * Custom middleware functions
 */

// Request validation middleware
const validateRequest = (req, res, next) => {
  try {
    // TODO: Implement request validation logic
    // Example: validate required fields, data types, etc.
    
    console.log(`[VALIDATION] ${req.method} ${req.path}`);
    
    // Add request timestamp
    req.timestamp = new Date().toISOString();
    
    next();
  } catch (error) {
    res.status(400).json({
      error: 'Validation failed',
      message: error.message
    });
  }
};

// Authentication middleware
const authMiddleware = (req, res, next) => {
  try {
    // TODO: Implement authentication logic
    // Example: verify JWT token, check API key, etc.
    
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No authorization header provided'
      });
    }
    
    // Placeholder auth check
    if (authHeader === 'Bearer valid-token') {
      req.user = { id: 1, email: 'test@example.com' };
      next();
    } else {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid token'
      });
    }
  } catch (error) {
    res.status(500).json({
      error: 'Authentication failed',
      message: error.message
    });
  }
};

// Request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });
  
  next();
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  // Default error response
  const response = {
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message,
    timestamp: new Date().toISOString()
  };
  
  // Add stack trace in development
  if (process.env.NODE_ENV !== 'production') {
    response.stack = err.stack;
  }
  
  res.status(err.status || 500).json(response);
};

module.exports = {
  validateRequest,
  authMiddleware,
  requestLogger,
  errorHandler
};