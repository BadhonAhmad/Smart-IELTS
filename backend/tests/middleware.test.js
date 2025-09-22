/**
 * Unit tests for middleware functions
 */

const {
  validateRequest,
  authMiddleware,
  requestLogger,
  errorHandler
} = require('../src/middleware/index');

describe('Middleware Tests', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      method: 'GET',
      path: '/test',
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      on: jest.fn()
    };
    next = jest.fn();
  });

  describe('validateRequest', () => {
    it('should add timestamp and call next', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      validateRequest(req, res, next);

      expect(req.timestamp).toBeDefined();
      expect(next).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });

    it('should handle validation errors', () => {
      const invalidReq = null; // This will cause an error
      
      validateRequest(invalidReq, res, next);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Validation failed'
        })
      );
    });
  });

  describe('authMiddleware', () => {
    it('should return 401 when no authorization header', () => {
      authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Unauthorized',
          message: 'No authorization header provided'
        })
      );
    });

    it('should return 401 for invalid token', () => {
      req.headers.authorization = 'Bearer invalid-token';
      
      authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Unauthorized',
          message: 'Invalid token'
        })
      );
    });

    it('should call next for valid token', () => {
      req.headers.authorization = 'Bearer valid-token';
      
      authMiddleware(req, res, next);

      expect(req.user).toBeDefined();
      expect(req.user.id).toBe(1);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('requestLogger', () => {
    it('should set up response listener', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      requestLogger(req, res, next);

      expect(res.on).toHaveBeenCalledWith('finish', expect.any(Function));
      expect(next).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });

  describe('errorHandler', () => {
    it('should handle errors with proper response', () => {
      const error = new Error('Test error');
      error.status = 400;
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Internal Server Error',
          timestamp: expect.any(String)
        })
      );
      
      consoleSpy.mockRestore();
    });

    it('should default to 500 status code', () => {
      const error = new Error('Test error');
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      
      consoleSpy.mockRestore();
    });
  });
});