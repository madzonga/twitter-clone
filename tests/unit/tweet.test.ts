/* eslint-disable @typescript-eslint/no-var-requires */
import dotenv from 'dotenv';
import request from 'supertest';
import app from '../../src/app';
import { generateToken } from '../utils';
dotenv.config({ path: '.env.test' });

// Mock the Tweet model
jest.mock('../../src/models/Tweet', () => {
  return {
    create: jest.fn(),
    findAll: jest.fn(),
    initialize: jest.fn(),
    belongsToMany: jest.fn(),
    belongsTo: jest.fn()
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
    initialize: jest.fn(),
    belongsToMany: jest.fn(),
    hasMany: jest.fn()
  };
});

// Mock the Queue
jest.mock('../../src/queues/tweetQueue', () => ({
  add: jest.fn(),
  close: jest.fn()
}));

const mockUser = require('../../src/models/User');
const mockTweet = require('../../src/models/Tweet');
const mockQueue = require('../../src/queues/tweetQueue');

describe('Tweet Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a tweet for an authenticated user', async () => {
    const user = {
      id: 1,
      username: 'testuser1',
      email: 'test1@example.com',
      password: 'password123'
    };

    // Mock User.findOne to return the test user
    mockUser.findOne.mockResolvedValueOnce(user);

    const newTweet = {
      id: 1,
      userId: user.id,
      content: 'This is a new tweet from user1'
    };

    // Mock Tweet.create to return the new tweet
    mockTweet.create.mockResolvedValueOnce(newTweet);

    const token = generateToken(user);

    const res = await request(app)
      .post('/tweets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'This is a new tweet from user1'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual({ message: 'Tweet is being processed' });

    expect(mockQueue.add).toHaveBeenCalledWith({
      content: 'This is a new tweet from user1',
      userId: user.id
    });
  });

  it('should not create a tweet if unauthenticated', async () => {
    // Simulate an unauthenticated request by not providing the Authorization header
    const res = await request(app)
      .post('/tweets')
      .send({
        content: 'This is an attempt to create a tweet without authentication'
      });

    expect(res.statusCode).toEqual(401); // Expecting Unauthorized status code
    expect(res.body).toHaveProperty('msg', 'No token, authorization denied'); // Adjusted to match the actual error message
  });

  it('should not create a tweet exceeding the character limit', async () => {
    const user = {
      id: 1,
      username: 'testuser1',
      email: 'test1@example.com',
      password: 'password123'
    };

    // Mock User.findOne to return the test user
    mockUser.findOne.mockResolvedValueOnce(user);

    const res = await request(app)
      .post('/tweets')
      .set('Authorization', `Bearer ${generateToken(user)}`)
      .send({
        content: 'a'.repeat(281) // 281 characters, exceeding the limit
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toContain('length must be less than or equal to 280 characters long');
  });
});

afterAll(async () => {
  await mockQueue.close(); // Ensure to close the mocked queue
});
