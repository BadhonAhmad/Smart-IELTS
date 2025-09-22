/**
 * Unit tests for utility functions
 */

const {
  formatResponse,
  successResponse,
  errorResponse,
  asyncHandler,
  paginate,
  validators,
  dateHelpers,
  stringHelpers
} = require('../src/utils/index');

describe('Utils Tests', () => {
  describe('formatResponse', () => {
    it('should format response correctly', () => {
      const result = formatResponse(true, 'Success', { id: 1 }, null);
      
      expect(result).toEqual({
        success: true,
        message: 'Success',
        data: { id: 1 },
        errors: null,
        timestamp: expect.any(String)
      });
    });
  });

  describe('successResponse', () => {
    it('should send success response', () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };
      
      successResponse(res, 'Success', { id: 1 }, 201);
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Success',
          data: { id: 1 }
        })
      );
    });
  });

  describe('errorResponse', () => {
    it('should send error response', () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };
      
      errorResponse(res, 'Error occurred', ['Field required'], 400);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Error occurred',
          errors: ['Field required']
        })
      );
    });
  });

  describe('asyncHandler', () => {
    it('should handle async functions', async () => {
      const mockFn = jest.fn().mockResolvedValue('success');
      const wrappedFn = asyncHandler(mockFn);
      const req = {};
      const res = {};
      const next = jest.fn();
      
      await wrappedFn(req, res, next);
      
      expect(mockFn).toHaveBeenCalledWith(req, res, next);
    });

    it('should catch errors and call next', async () => {
      const error = new Error('Async error');
      const mockFn = jest.fn().mockRejectedValue(error);
      const wrappedFn = asyncHandler(mockFn);
      const req = {};
      const res = {};
      const next = jest.fn();
      
      await wrappedFn(req, res, next);
      
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('paginate', () => {
    it('should calculate pagination correctly', () => {
      const result = paginate(2, 10);
      
      expect(result).toEqual({
        limit: 10,
        offset: 10,
        page: 2
      });
    });

    it('should handle default values', () => {
      const result = paginate();
      
      expect(result).toEqual({
        limit: 10,
        offset: 0,
        page: 1
      });
    });
  });

  describe('validators', () => {
    describe('isEmail', () => {
      it('should validate email addresses', () => {
        expect(validators.isEmail('test@example.com')).toBe(true);
        expect(validators.isEmail('invalid-email')).toBe(false);
        expect(validators.isEmail('test@')).toBe(false);
      });
    });

    describe('isPhone', () => {
      it('should validate phone numbers', () => {
        expect(validators.isPhone('+1234567890')).toBe(true);
        expect(validators.isPhone('123-456-7890')).toBe(true);
        expect(validators.isPhone('invalid')).toBe(false);
      });
    });

    describe('isStrongPassword', () => {
      it('should validate strong passwords', () => {
        expect(validators.isStrongPassword('StrongP@ss1')).toBe(true);
        expect(validators.isStrongPassword('weak')).toBe(false);
        expect(validators.isStrongPassword('NoSpecialChar1')).toBe(false);
      });
    });

    describe('isValidObjectId', () => {
      it('should validate MongoDB ObjectIds', () => {
        expect(validators.isValidObjectId('507f1f77bcf86cd799439011')).toBe(true);
        expect(validators.isValidObjectId('invalid-id')).toBe(false);
        expect(validators.isValidObjectId('123')).toBe(false);
      });
    });
  });

  describe('dateHelpers', () => {
    describe('formatDate', () => {
      it('should format dates correctly', () => {
        const date = new Date('2023-12-25T10:30:00Z');
        const result = dateHelpers.formatDate(date);
        
        expect(result).toBe('2023-12-25');
      });
    });

    describe('addDays', () => {
      it('should add days to date', () => {
        const date = new Date('2023-12-25');
        const result = dateHelpers.addDays(date, 5);
        
        expect(result.getDate()).toBe(30);
      });
    });

    describe('isExpired', () => {
      it('should check if date is expired', () => {
        const pastDate = new Date('2020-01-01');
        const futureDate = new Date('2030-01-01');
        
        expect(dateHelpers.isExpired(pastDate)).toBe(true);
        expect(dateHelpers.isExpired(futureDate)).toBe(false);
      });
    });
  });

  describe('stringHelpers', () => {
    describe('capitalize', () => {
      it('should capitalize strings', () => {
        expect(stringHelpers.capitalize('hello')).toBe('Hello');
        expect(stringHelpers.capitalize('WORLD')).toBe('World');
      });
    });

    describe('slugify', () => {
      it('should create slugs from strings', () => {
        expect(stringHelpers.slugify('Hello World!')).toBe('hello-world');
        expect(stringHelpers.slugify('Test_String-123')).toBe('test-string-123');
      });
    });

    describe('generateRandomString', () => {
      it('should generate random strings', () => {
        const result = stringHelpers.generateRandomString(10);
        
        expect(result).toHaveLength(10);
        expect(typeof result).toBe('string');
      });

      it('should generate different strings', () => {
        const result1 = stringHelpers.generateRandomString(10);
        const result2 = stringHelpers.generateRandomString(10);
        
        expect(result1).not.toBe(result2);
      });
    });
  });
});