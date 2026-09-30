const request = require('supertest');
const app = require('../src/app');

describe('Products Endpoints & Validation', () => {
  describe('GET /products', () => {
    it('should validate query parameters (invalid page/limit)', async () => {
      const res = await request(app)
        .get('/products?page=-1&limit=999');

      expect(res.statusCode).toBe(422);
      expect(res.body.status).toBe('fail');
    });

    it('should validate invalid sort field', async () => {
      const res = await request(app)
        .get('/products?sortBy=invalid_column');

      expect(res.statusCode).toBe(422);
      expect(res.body.status).toBe('fail');
    });
  });

  describe('GET /products/:id', () => {
    it('should reject non-integer product ID with 422', async () => {
      const res = await request(app)
        .get('/products/abc');

      expect(res.statusCode).toBe(422);
    });
  });

  describe('POST /products (Admin protected)', () => {
    it('should reject unauthenticated request with 401', async () => {
      const res = await request(app)
        .post('/products')
        .send({
          name: 'New Product',
          price: 99.99
        });

      expect(res.statusCode).toBe(401);
    });
  });

  describe('PUT /products/:id (Admin protected)', () => {
    it('should reject unauthenticated request with 401', async () => {
      const res = await request(app)
        .put('/products/1')
        .send({ price: 79.99 });

      expect(res.statusCode).toBe(401);
    });
  });

  describe('DELETE /products/:id (Admin protected)', () => {
    it('should reject unauthenticated request with 401', async () => {
      const res = await request(app)
        .delete('/products/1');

      expect(res.statusCode).toBe(401);
    });
  });
});
