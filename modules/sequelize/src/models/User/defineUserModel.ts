import { Sequelize, DataTypes } from 'sequelize';
import { StaticModel } from '../types';
import { UserModel } from './types';
import { USER_ROLES } from '@stringsync/domain';

export const defineUserModel = (sequelize: Sequelize) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.TEXT,
        primaryKey: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: true,
        },
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: true,
        },
      },
      username: {
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
        type: DataTypes.TEXT,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM(...USER_ROLES),
        allowNull: false,
        defaultValue: USER_ROLES[0],
      },
      confirmationToken: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      confirmedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      resetPasswordToken: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      resetPasswordTokenSentAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      avatarUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      underscored: true,
      tableName: 'users',
    }
  ) as StaticModel<UserModel>;

  return User;
};
