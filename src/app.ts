import express from 'express';
import dotenv from 'dotenv';
import sequelize from './config/db';
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

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // Ensure tables are created
    console.log('Database connected!');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});

export default app;