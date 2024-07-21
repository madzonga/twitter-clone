import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import request from 'supertest';
import app from '../../src/app';
import bcrypt from 'bcryptjs';

jest.mock('../../src/models/User', () => {
  const originalModule = jest.requireActual('../../src/models/User');
  return {
    ...originalModule,
    create: jest.fn(),
    findOne: jest.fn(),
  };
});

// Mock the User model
const mockUser = require('../../src/models/User');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Auth Routes', () => {
  it('should sign up a user successfully', async () => {
    mockUser.create.mockResolvedValueOnce({
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });

    const res = await request(app)
      .post('/auth/signup')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should not sign up a user with an existing email', async () => {
    mockUser.findOne.mockResolvedValueOnce({
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });

    const res = await request(app)
      .post('/auth/signup')
      .send({
        username: 'testuser2',
        email: 'test@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(400);
  });

  it('should log in a user successfully', async () => {
    mockUser.findOne.mockResolvedValueOnce({
      id: 2,
      username: 'testuser3',
      email: 'login@example.com',
      password: await bcrypt.hash('password123', 10),
    });

    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'login@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not log in a user with incorrect password', async () => {
    mockUser.findOne.mockResolvedValueOnce({
      id: 3,
      username: 'testuser4',
      email: 'incorrect@example.com',
      password: 'password123',
    });

    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'incorrect@example.com',
        password: 'wrongpassword',
      });

    expect(res.statusCode).toEqual(400);
  });
});
