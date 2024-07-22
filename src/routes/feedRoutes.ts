import { Router } from 'express';
import { getTimeline, getPublicFeed } from '../controllers/feedController';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

router.get('/timeline', authMiddleware, getTimeline);
router.get('/public', getPublicFeed);

export default router;
