import { Model, DataTypes } from 'sequelize';
import db from '../util/db';

class User extends Model {
  public id: number;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public username: string;
  public email: string;
}

User.init(
  {
    id: {
      field: 'id',
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    createdAt: {
      field: 'created_at',
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      field: 'updated_at',
      type: DataTypes.DATE,
      allowNull: false,
    },
    username: {
      field: 'username',
      type: DataTypes.TEXT,
      allowNull: false,
    },
    email: {
      field: 'email',
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: 'users',
    sequelize: db,
  }
);

export default User;
