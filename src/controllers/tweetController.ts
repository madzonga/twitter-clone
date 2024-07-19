import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Tweet from '../models/Tweet';
import User from '../models/User';
import Tag from '../models/Tag';

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

    // Extract and handle mentions
    const mentions = content.match(/@\w+/g);
    if (mentions) {
      for (const mention of mentions) {
        const username = mention.slice(1);
        const taggedUser = await User.findOne({ where: { username } });
        if (taggedUser) {
          await Tag.create({
            tweetId: tweet.id,
            userId: taggedUser.id,
          });
        }
      }
    }

    res.status(201).json(tweet);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const getTweetsByMention = async (req: Request, res: Response) => {
  try {
    const user = req.user as User;
    const tweets = await Tweet.findAll({
      include: [
        {
          model: User,
          through: {
            attributes: [],
          },
          where: {
            id: user.id,
          },
        },
      ],
    });
    res.json(tweets);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export { createTweet, getTweetsByMention };