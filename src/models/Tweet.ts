import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import User from './User';

interface TweetAttributes {
  id: number;
  content: string;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface TweetCreationAttributes extends Optional<TweetAttributes, 'id'> {}

class Tweet extends Model<TweetAttributes, TweetCreationAttributes> implements TweetAttributes {
  public id!: number;
  public content!: string;
  public userId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static initialize(sequelize: Sequelize) {
    Tweet.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        content: {
          type: DataTypes.STRING(280),
          allowNull: false,
        },
        userId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'tweets',
      }
    );
  }
}

export default Tweet;