/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import tweetQueue from '../queues/tweetQueue';
import User from '../models/User';

const createTweet = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { content } = req.body;

  try {
    const user = req.user as User;

    console.log('Adding job to queue');
    await tweetQueue.add({
      content,
      userId: user.id
    });
    console.log('Job added to queue');

    res.status(201).json({ message: 'Tweet is being processed' });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export { createTweet };
