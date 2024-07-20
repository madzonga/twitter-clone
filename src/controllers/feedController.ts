import { Request, Response } from 'express';
import Tweet from '../models/Tweet';
import User from '../models/User';

const getTimeline = async (req: Request, res: Response) => {
  try {
    const user = req.user as User;

    const tweets = await Tweet.findAll({
      where: { userId: user.id },
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const taggedTweets = await Tweet.findAll({
        include: [
          {
            model: User,
            as: 'Tags',
            where: {
              id: user.id,
            },
            attributes: ['id', 'username'],  // Adjust attributes as needed
            through: {
              attributes: [],  // Exclude join table attributes
            },
          },
        ],
        order: [['createdAt', 'DESC']],
      });

    const timeline = [...tweets, ...taggedTweets].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );

    res.json(timeline);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const getPublicFeed = async (req: Request, res: Response) => {
  try {
    const tweets = await Tweet.findAll({
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(tweets);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export { getTimeline, getPublicFeed };