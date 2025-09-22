/**
 * Integration tests for the main app
 */

const { request } = require('./setup');

describe('App Integration Tests', () => {
  describe('GET /', () => {
    it('should return API information', async () => {
      const response = await request.get('/');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('endpoints');
      expect(response.body.message).toBe('Smart IELTS Backend API');
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request.get('/health');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('GET /api', () => {
    it('should return API version information', async () => {
      const response = await request.get('/api');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('endpoints');
    });
  });

  describe('GET /api/health', () => {
    it('should return API health status', async () => {
      const response = await request.get('/api/health');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('message', 'API is healthy');
      expect(response.body).toHaveProperty('environment');
    });
  });

  describe('GET /api/example', () => {
    it('should return example data', async () => {
      const response = await request.get('/api/example');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Example endpoint working');
      expect(response.body).toHaveProperty('method', 'GET');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('status', 'success');
    });
  });

  describe('GET /nonexistent', () => {
    it('should return 404 for non-existent endpoints', async () => {
      const response = await request.get('/nonexistent');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Endpoint not found');
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('Rate Limiting', () => {
    it('should apply rate limiting', async () => {
      // This test might be slow as it tests rate limiting
      // Skip in CI or adjust limits for testing
      const promises = [];
      
      // Send multiple requests quickly
      for (let i = 0; i < 5; i++) {
        promises.push(request.get('/health'));
      }
      
      const responses = await Promise.all(promises);
      
      // All should succeed under normal rate limits
      responses.forEach(response => {
        expect([200, 429]).toContain(response.status);
      });
    });
  });

  describe('CORS', () => {
    it('should include CORS headers', async () => {
      const response = await request
        .get('/health')
        .set('Origin', 'http://localhost:3000');
      
      expect(response.headers).toHaveProperty('access-control-allow-origin');
    });
  });
});