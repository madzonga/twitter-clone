/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
import dotenv from 'dotenv';
import request from 'supertest';
import app from '../../src/app';
import jwt from 'jsonwebtoken';
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

const mockUser = require('../../src/models/User');
const mockTweet = require('../../src/models/Tweet');

// Helper function to generate a JWT token
const generateToken = (user: object) => {
  const token = jwt.sign({ user }, process.env.JWT_SECRET || 'defaultsecret', {
    expiresIn: '1h'
  });
  return token;
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Feed Routes', () => {
  it('should get the timeline for an authenticated user', async () => {
    const user = {
      id: 1,
      username: 'testuser1',
      email: 'test1@example.com',
      password: 'password123'
    };

    const tweets = [
      { id: 1, content: 'This is a tweet from user1', createdAt: new Date() },
      { id: 2, content: 'Another tweet from user1', createdAt: new Date() }
    ];

    mockUser.findOne.mockResolvedValueOnce(user);
    mockTweet.findAll.mockResolvedValueOnce(tweets);

    const token = generateToken(user);

    const res = await request(app)
      .get('/feed/timeline')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('content');
  });

  it('should include tagged tweets in the timeline for an authenticated user', async () => {
    // Mock user data
    const user = {
      id: 1,
      username: 'testuser1',
      email: 'test1@example.com',
      password: 'password123'
    };

    const otherUser = {
      id: 2,
      username: 'testuser2',
      email: 'test2@example.com',
      password: 'password123'
    };

    // Mock tweets data
    const tweets = [
      {
        id: 1,
        content: 'This is a tweet from user1',
        createdAt: new Date(),
        userId: user.id
      },
      {
        id: 2,
        content: 'Another tweet from user1',
        createdAt: new Date(),
        userId: user.id
      }
    ];

    const taggedTweets = [
      {
        id: 3,
        content: 'Mentioning @testuser2',
        createdAt: new Date(),
        userId: otherUser.id
      }
    ];

    // Mock the User model methods
    mockUser.findOne.mockResolvedValueOnce(user);

    // Mock the Tweet model methods
    jest.spyOn(mockTweet, 'findAll').mockImplementation((query: any) => {
      if (query.where && query.where.userId) {
        // Return user's own tweets
        return Promise.resolve(tweets);
      }
      // Return tagged tweets
      return Promise.resolve(taggedTweets);
    });

    // Generate a token for the user
    const token = generateToken(user);

    // Make the API request
    const res = await request(app)
      .get('/feed/timeline')
      .set('Authorization', `Bearer ${token}`);

    // Assertions
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);

    // Check if the tagged tweet is included in the response
    expect(res.body).toEqual(expect.arrayContaining([
      expect.objectContaining({
        content: expect.stringContaining('@testuser2')
      })
    ]));
  });

  it('should get the public feed', async () => {
    const tweets = [
      { id: 1, content: 'This is a public tweet', createdAt: new Date() }
    ];

    mockTweet.findAll.mockResolvedValueOnce(tweets);

    const res = await request(app).get('/feed/public');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('content');
  });

  it('should return an empty timeline for a user with no tweets or mentions', async () => {
    const newUser = {
      id: 3,
      username: 'testuser3',
      email: 'test3@example.com',
      password: 'password123'
    };

    // Mock User model
    mockUser.findOne.mockResolvedValueOnce(newUser);

    // Mock Tweet model to return an empty array
    mockTweet.findAll.mockImplementation((query: any) => {
      if (query.where && query.where.userId) {
        // Ensure no tweets are returned for this user
        return Promise.resolve([]);
      }
      // Ensure no tagged tweets are returned
      return Promise.resolve([]);
    });

    const token = generateToken(newUser);

    const res = await request(app)
      .get('/feed/timeline')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toEqual(0);
  });
});

afterAll(async () => {
  // If you have any cleanup to do after all tests, do it here.
});
