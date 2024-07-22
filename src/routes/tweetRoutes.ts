import { Router } from 'express';
import { createTweet } from '../controllers/tweetController';
import authMiddleware from '../middlewares/authMiddleware';
import validate from '../middlewares/validate';
import { tweetSchema } from '../validation/tweetValidation';

const router = Router();

router.post('/', authMiddleware, validate(tweetSchema), createTweet);

export default router;
