const request = require('supertest');
const app = require('../src/app');

describe('Orders Endpoints & Authentication', () => {
  describe('POST /orders', () => {
    it('should reject unauthenticated request with 401', async () => {
      const res = await request(app)
        .post('/orders')
        .send({ shippingAddress: '123 Main St, Springfield' });

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /orders', () => {
    it('should reject unauthenticated request with 401', async () => {
      const res = await request(app).get('/orders');
      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /orders/:id', () => {
    it('should reject unauthenticated request with 401', async () => {
      const res = await request(app).get('/orders/1');
      expect(res.statusCode).toBe(401);
    });
  });

  describe('PATCH /orders/:id/status', () => {
    it('should reject unauthenticated request with 401', async () => {
      const res = await request(app)
        .patch('/orders/1/status')
        .send({ status: 'shipped' });

      expect(res.statusCode).toBe(401);
    });
  });
});
