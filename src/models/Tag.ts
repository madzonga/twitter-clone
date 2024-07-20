import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface TagAttributes {
  id: number;
  tweetId: number;
  userId: number;
}

interface TagCreationAttributes extends Optional<TagAttributes, 'id'> {}

class Tag extends Model<TagAttributes, TagCreationAttributes> implements TagAttributes {
  public id!: number;
  public tweetId!: number;
  public userId!: number;

  public static initialize(sequelize: Sequelize) {
    Tag.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        tweetId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
        },
        userId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'tags',
      }
    );
  }
}

export default Tag;