/**
 * Utility functions and helpers
 */

// Response formatter utility
const formatResponse = (success, message, data = null, errors = null) => {
  return {
    success,
    message,
    data,
    errors,
    timestamp: new Date().toISOString()
  };
};

// Success response helper
const successResponse = (res, message, data = null, statusCode = 200) => {
  return res.status(statusCode).json(formatResponse(true, message, data));
};

// Error response helper
const errorResponse = (res, message, errors = null, statusCode = 400) => {
  return res.status(statusCode).json(formatResponse(false, message, null, errors));
};

// Async error handler wrapper
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Pagination helper
const paginate = (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  return {
    limit: parseInt(limit),
    offset: parseInt(offset),
    page: parseInt(page)
  };
};

// Validation helpers
const validators = {
  isEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  isPhone: (phone) => {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    return phoneRegex.test(phone);
  },
  
  isStrongPassword: (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  },
  
  isValidObjectId: (id) => {
    // MongoDB ObjectId format
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    return objectIdRegex.test(id);
  }
};

// Date helpers
const dateHelpers = {
  formatDate: (date) => {
    return new Date(date).toISOString().split('T')[0];
  },
  
  addDays: (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },
  
  isExpired: (date) => {
    return new Date(date) < new Date();
  }
};

// String helpers
const stringHelpers = {
  capitalize: (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },
  
  slugify: (str) => {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },
  
  generateRandomString: (length = 10) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
};

module.exports = {
  formatResponse,
  successResponse,
  errorResponse,
  asyncHandler,
  paginate,
  validators,
  dateHelpers,
  stringHelpers
};