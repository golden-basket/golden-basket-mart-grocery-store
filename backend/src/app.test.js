const request = require('supertest');
const app = require('./app');
describe('Auth Endpoints', () => {
  it('should return 400 for invalid registration', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'bad', password: '123' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });
}); 