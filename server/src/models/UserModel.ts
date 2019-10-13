import { Model, DataTypes, BuildOptions } from 'sequelize';
import db from '../util/db';
import { UserRoles } from 'common/types';

const USER_ROLES: UserRoles[] = ['student', 'teacher', 'admin'];

export interface UserModel extends Model {
  id: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  username: string;
  email: string;
  encryptedPassword: string;
  role: UserRoles;
  confirmationToken: string;
  confirmedAt: Date;
  resetPasswordToken: string;
  resetPasswordTokenSentAt: Date;
  avatarUrl: string;
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
    role: {
      field: 'role',
      type: DataTypes.ENUM(...USER_ROLES),
      allowNull: false,
      defaultValue: USER_ROLES[0],
    },
    confirmationToken: {
      field: 'confirmation_token',
      type: DataTypes.TEXT,
      allowNull: true,
    },
    confirmedAt: {
      field: 'confirmed_at',
      type: DataTypes.DATE,
      allowNull: true,
    },
    resetPasswordToken: {
      field: 'reset_password_token',
      type: DataTypes.TEXT,
      allowNull: true,
    },
    resetPasswordTokenSentAt: {
      field: 'reset_password_token_sent_at',
      type: DataTypes.DATE,
      allowNull: true,
    },
    avatarUrl: {
      field: 'avatar_url',
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'users',
  }
) as UserModelStatic;
