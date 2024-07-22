import Queue from 'bull';
import dotenv from 'dotenv';
import { sequelize } from '../models';
import Tweet from '../models/Tweet';
import User from '../models/User';
import Tag from '../models/Tag';

dotenv.config();

const tweetQueue = new Queue('tweetQueue', {
  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT)
  }
});

tweetQueue.process(async (job, done) => {
  console.log('Processing job:', job.id);
  const transaction = await sequelize.transaction(); // Start a new transaction

  try {
    const { content, userId } = job.data;

    const tweet = await Tweet.create({
      content,
      userId
    }, { transaction }); // Pass the transaction

    // Extract and handle mentions
    const mentions = content.match(/@\w+/g);
    if (mentions) {
      for (const mention of mentions) {
        const username = mention.slice(1);
        const taggedUser = await User.findOne({ where: { username } }); // Pass the transaction
        if (taggedUser) {
          await Tag.create({
            tweetId: tweet.id,
            userId: taggedUser.id
          }, { transaction }); // Pass the transaction
        }
      }
    }

    await transaction.commit(); // Commit the transaction if all operations are successful
    console.log('Job processed:', job.id);
    done();
  } catch (error: unknown) {
    await transaction.rollback(); // Rollback the transaction in case of any errors
    console.error('Error processing job:', error);
    done(error as Error);
  }
});

tweetQueue.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

tweetQueue.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed with error: ${err.message}`);
});

export default tweetQueue;
