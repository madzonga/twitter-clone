import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_PATH || './database.sqlite',
  logging: false
});

export default sequelize;
