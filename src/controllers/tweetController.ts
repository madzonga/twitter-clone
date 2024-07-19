import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Tweet from '../models/Tweet';
import User from '../models/User';

const createTweet = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { content } = req.body;

  try {
    const user = req.user as User;

    const tweet = await Tweet.create({
      content,
      userId: user.id,
    });

    res.status(201).json(tweet);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export { createTweet };