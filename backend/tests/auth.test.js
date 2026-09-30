const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/db');
const bcrypt = require('bcryptjs');

describe('Auth Endpoints & Validation', () => {
  describe('POST /auth/register', () => {
    it('should fail with 422 if required fields are missing', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({});

      expect(res.statusCode).toBe(422);
      expect(res.body.status).toBe('fail');
      expect(Array.isArray(res.body.errors)).toBe(true);
    });

    it('should fail with 422 if email is invalid', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          name: 'Test User',
          email: 'not-an-email',
          password: 'password123'
        });

      expect(res.statusCode).toBe(422);
      expect(res.body.errors.some(e => e.field === 'email')).toBe(true);
    });

    it('should fail with 422 if password is too short', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          name: 'Test User',
          email: 'valid@example.com',
          password: '123'
        });

      expect(res.statusCode).toBe(422);
      expect(res.body.errors.some(e => e.field === 'password')).toBe(true);
    });
  });

  describe('POST /auth/login', () => {
    it('should fail with 422 if email or password missing', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'test@example.com' });

      expect(res.statusCode).toBe(422);
    });
  });

  describe('POST /auth/refresh', () => {
    it('should fail with 422 if refreshToken is missing', async () => {
      const res = await request(app)
        .post('/auth/refresh')
        .send({});

      expect(res.statusCode).toBe(422);
    });
  });

  describe('GET /auth/me', () => {
    it('should fail with 401 Unauthorized if Authorization header is missing', async () => {
      const res = await request(app)
        .get('/auth/me');

      expect(res.statusCode).toBe(401);
      expect(res.body.status).toBe('fail');
    });

    it('should fail with 401 Unauthorized with invalid Bearer token', async () => {
      const res = await request(app)
        .get('/auth/me')
        .set('Authorization', 'Bearer invalidtoken123');

      expect(res.statusCode).toBe(401);
    });
  });
});
