import { Router } from 'express';
import { check } from 'express-validator';
import { createTweet } from '../controllers/tweetController';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

router.post(
  '/',
  authMiddleware,
  [
    check('content', 'Content is required').not().isEmpty(),
    check('content', 'Content cannot exceed 280 characters').isLength({ max: 280 }),
  ],
  createTweet
);

export default router;