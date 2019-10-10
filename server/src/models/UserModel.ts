import { Model, DataTypes, BuildOptions } from 'sequelize';
import db from '../util/db';

export interface UserModel extends Model {
  id: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  username: string;
  email: string;
  encryptedPassword: string;
}

export type UserModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): UserModel;
};

export const UserModel = db.define(
  'User',
  {
    id: {
      field: 'id',
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    createdAt: {
      field: 'created_at',
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
      },
    },
    updatedAt: {
      field: 'updated_at',
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
      },
    },
    username: {
      field: 'username',
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: {
          args: [3, 36],
          msg: 'username must be between 3 and 36 characters',
        },
      },
    },
    email: {
      field: 'email',
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: {
          args: [3, 36],
          msg: 'email must be betweem 3 and 36 characters',
        },
        isEmail: {
          msg: 'email must be valid',
        },
      },
    },
    encryptedPassword: {
      field: 'encrypted_password',
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: 'users',
  }
) as UserModelStatic;
