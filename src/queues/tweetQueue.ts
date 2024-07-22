import Queue from 'bull';
import dotenv from 'dotenv';
import Tweet from '../models/Tweet';
import Tag from '../models/Tag';
import User from '../models/User';

dotenv.config();

const tweetQueue = new Queue('tweetQueue', {
  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

tweetQueue.process(async (job, done) => {
  console.log('Processing job:', job.id);
  try {
    const { content, userId } = job.data;

    const tweet = await Tweet.create({
      content,
      userId,
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

    console.log('Job processed:', job.id);
    done();
  } catch (error: any) {
    console.error('Error processing job:', error);
    done(error);
  }
});

tweetQueue.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

tweetQueue.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed with error: ${err.message}`);
});

export default tweetQueue;