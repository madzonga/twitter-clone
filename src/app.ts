import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import tweetRoutes from './routes/tweetRoutes';
import feedRoutes from './routes/feedRoutes';

dotenv.config();

const app = express();

app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/tweets', tweetRoutes);
app.use('/feed', feedRoutes);

export default app;