import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import request from 'supertest';
import app from '../../src/app';
import jwt from 'jsonwebtoken';


// Mock the Tweet model
jest.mock('../../src/models/Tweet', () => {
  return {
    create: jest.fn(),
    findAll: jest.fn(),
  };
});

// Mock the User model
jest.mock('../../src/models/User', () => {
  const originalModule = jest.requireActual('../../src/models/User');
  return {
    ...originalModule,
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
  };
});

const mockUser = require('../../src/models/User');
const mockTweet = require('../../src/models/Tweet');

// Helper function to generate a JWT token
const generateToken = (user: any) => {
  const token = jwt.sign({ user }, process.env.JWT_SECRET || 'defaultsecret', {
    expiresIn: '1h',
  });
  return token;
};

describe('Tweet Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a tweet for an authenticated user', async () => {
    const user = {
      id: 1,
      username: 'testuser1',
      email: 'test1@example.com',
      password: 'password123',
    };

    // Mock User.findOne to return the test user
    mockUser.findOne.mockResolvedValueOnce(user);

    const newTweet = {
      id: 1,
      userId: user.id,
      content: 'This is a new tweet from user1',
    };

    // Mock Tweet.create to return the new tweet
    mockTweet.create.mockResolvedValueOnce(newTweet);

    const token = generateToken(user);

    const res = await request(app)
      .post('/tweets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'This is a new tweet from user1',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('content', 'This is a new tweet from user1');
    expect(res.body).toHaveProperty('userId', user.id);
  });

  it('should not create a tweet if unauthenticated', async () => {
    // Simulate an unauthenticated request by not providing the Authorization header
    const res = await request(app)
      .post('/tweets')
      .send({
        content: 'This is an attempt to create a tweet without authentication',
      });

    expect(res.statusCode).toEqual(401); // Expecting Unauthorized status code
    expect(res.body).toHaveProperty('msg', 'No token, authorization denied'); // Adjusted to match the actual error message
  });

  it('should not create a tweet exceeding the character limit', async () => {
    const user = {
      id: 1,
      username: 'testuser1',
      email: 'test1@example.com',
      password: 'password123',
    };

    // Mock User.findOne to return the test user
    mockUser.findOne.mockResolvedValueOnce(user);

    const res = await request(app)
      .post('/tweets')
      .set('Authorization', `Bearer ${generateToken(user)}`)
      .send({
        content: 'a'.repeat(281), // 281 characters, exceeding the limit
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });
});

// Close the database connection after all tests are done
afterAll(async () => {
  // Any necessary cleanup can be done here
});