import { Sequelize } from 'sequelize';
import User from './User';
import Tweet from './Tweet';
import Tag from './Tag';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_PATH || './database.sqlite',
  logging: false, // Set to true for SQL query logging
});

// Initialize models
User.initialize(sequelize);
Tweet.initialize(sequelize);
Tag.initialize(sequelize);

// Define associations
User.hasMany(Tweet, { foreignKey: 'userId' });
Tweet.belongsTo(User, { foreignKey: 'userId' });

User.belongsToMany(Tweet, { through: Tag, foreignKey: 'userId' });
Tweet.belongsToMany(User, { through: Tag, foreignKey: 'tweetId' });

export { sequelize, User, Tweet, Tag };