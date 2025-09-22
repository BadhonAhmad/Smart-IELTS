/**
 * Unit tests for controllers
 */

const { healthController, exampleController, userController } = require('../src/controllers/index');

describe('Controller Tests', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      method: 'GET',
      path: '/test',
      params: {},
      body: {},
      query: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  describe('healthController', () => {
    it('should return health status', () => {
      healthController(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'OK',
          message: 'API is healthy',
          timestamp: expect.any(String),
          uptime: expect.any(Number)
        })
      );
    });

    it('should handle errors gracefully', () => {
      // Test error handling by mocking process.uptime to throw an error
      const originalUptime = process.uptime;
      process.uptime = jest.fn().mockImplementation(() => {
        throw new Error('Test error');
      });
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      healthController(req, res);

      // Restore original function
      process.uptime = originalUptime;
      consoleSpy.mockRestore();
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'ERROR',
          message: 'Health check failed'
        })
      );
    });
  });

  describe('exampleController', () => {
    it('should return example data', () => {
      exampleController(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Example endpoint working',
          method: 'GET',
          path: '/test',
          data: expect.objectContaining({
            status: 'success'
          })
        })
      );
    });
  });

  describe('userController', () => {
    describe('getUsers', () => {
      it('should return users list', async () => {
        await userController.getUsers(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({
            message: 'Get users endpoint',
            users: []
          })
        );
      });
    });

    describe('getUserById', () => {
      it('should return user by ID', async () => {
        req.params.id = '123';
        await userController.getUserById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({
            message: 'Get user by ID: 123',
            user: null
          })
        );
      });
    });

    describe('createUser', () => {
      it('should create a new user', async () => {
        req.body = { name: 'Test User', email: 'test@example.com' };
        await userController.createUser(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({
            message: 'User created successfully',
            user: req.body
          })
        );
      });
    });
  });
});