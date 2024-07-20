import User from './User';
import Tweet from './Tweet';
import Tag from './Tag';
import dotenv from 'dotenv';
import sequelize from '../config/db';

dotenv.config();

// Initialize models
User.initialize(sequelize);
Tweet.initialize(sequelize);
Tag.initialize(sequelize);

// Define associations
User.hasMany(Tweet, { foreignKey: 'userId' });
Tweet.belongsTo(User, { foreignKey: 'userId' });

User.belongsToMany(Tweet, { through: Tag, as: 'TaggedTweets', foreignKey: 'userId' });
Tweet.belongsToMany(User, { through: Tag, as: 'Tags', foreignKey: 'tweetId' });

export { sequelize, User, Tweet, Tag };