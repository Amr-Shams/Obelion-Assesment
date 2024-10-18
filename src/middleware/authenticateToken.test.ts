import request from 'supertest';
import express from 'express';
import { authenticateToken } from '../middleware/authenticateToken';
import { describe, it, expect } from '@jest/globals';

const app = express();
app.use(express.json());

app.get('/protected', authenticateToken, (req, res) => {
  res.status(200).json({ message: 'Access granted' });
});

describe('authenticateToken Middleware', () => {
  it('should allow access with a valid token', async () => {
    const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhbXIuc2hhbXMyMDE1LmFzQGdtYWlsLmNvbSIsImlhdCI6MTcyOTI0MTIwNywiZXhwIjoxNzI5MjQ0ODA3fQ.HX1JmqrD9ke0HHnsszj2Lb0uE9bpzsLYaRcfva7YS0E';

    const response = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${validToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Access granted' });
  });

  it('should deny access with an invalid token', async () => {
    const invalidToken = 'invalid.token.here';

    const response = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${invalidToken}`);

    expect(response.status).toBe(403);
  });

  it('should deny access without a token', async () => {
    const response = await request(app).get('/protected');

    expect(response.status).toBe(401);
  });
});

