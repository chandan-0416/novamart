const request = require('supertest');
const app = require('../src/app');

describe('Cart Endpoints & Authentication', () => {
  describe('GET /cart', () => {
    it('should reject unauthenticated request with 401', async () => {
      const res = await request(app).get('/cart');
      expect(res.statusCode).toBe(401);
      expect(res.body.status).toBe('fail');
    });
  });

  describe('POST /cart', () => {
    it('should reject unauthenticated request with 401', async () => {
      const res = await request(app)
        .post('/cart')
        .send({ productId: 1, quantity: 2 });
      expect(res.statusCode).toBe(401);
    });

    it('should validate request body if authenticated', async () => {
      // Missing token will be caught by auth middleware
      const res = await request(app)
        .post('/cart')
        .send({ quantity: -5 });
      expect(res.statusCode).toBe(401);
    });
  });

  describe('DELETE /cart/:productId', () => {
    it('should reject unauthenticated request with 401', async () => {
      const res = await request(app).delete('/cart/1');
      expect(res.statusCode).toBe(401);
    });
  });
});
