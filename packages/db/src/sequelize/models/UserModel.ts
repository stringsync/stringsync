/* eslint-disable @typescript-eslint/member-ordering */

import { User, UserRole } from '@stringsync/domain';
import { Association, DataTypes, Model, Sequelize } from 'sequelize';
import { NotationModel } from './NotationModel';

export class UserModel extends Model<User, Partial<User>> implements User {
  static initColumns(sequelize: Sequelize) {
    UserModel.init(
      {
        id: {
          type: DataTypes.TEXT,
          primaryKey: true,
          unique: true,
        },
        cursor: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
        },
        createdAt: {
          type: DataTypes.DATE,
        },
        updatedAt: {
          type: DataTypes.DATE,
        },
        username: {
          type: DataTypes.TEXT,
          unique: true,
          allowNull: false,
          validate: {
            is: /^[A-Za-z0-9-_.]*$/,
            len: [3, 24],
          },
        },
        email: {
          type: DataTypes.TEXT,
          unique: true,
          allowNull: false,
          validate: {
            isEmail: true,
          },
          set(value: string) {
            this.setDataValue('email', value);
            if (!this.isNewRecord && this.previous('email') !== value) {
              this.confirmedAt = null;
              this.confirmationToken = null;
            }
          },
        },
        encryptedPassword: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        role: {
          type: DataTypes.ENUM(UserRole.STUDENT, UserRole.TEACHER, UserRole.ADMIN),
          defaultValue: UserRole.STUDENT,
          allowNull: false,
        },
        confirmationToken: {
          type: DataTypes.TEXT,
          unique: true,
          allowNull: true,
          validate: {
            isUUID: 4,
          },
        },
        confirmedAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        resetPasswordToken: {
          type: DataTypes.TEXT,
          unique: true,
          allowNull: true,
        },
        resetPasswordTokenSentAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        avatarUrl: {
          type: DataTypes.TEXT,
          allowNull: true,
          validate: {
            isUrl: true,
          },
        },
      },
      {
        sequelize,
        tableName: 'users',
        modelName: 'user',
        underscored: true,
      }
    );
  }

  static initAssociations() {
    UserModel.hasMany(NotationModel, { sourceKey: 'id', foreignKey: 'transcriberId', as: 'notations' });
  }

  static associations: {
    notations: Association<UserModel, NotationModel>;
  };

  notations?: NotationModel[];

  id!: string;
  cursor!: number;
  createdAt!: Date;
  updatedAt!: Date;
  username!: string;
  email!: string;
  encryptedPassword!: string;
  role!: UserRole;
  confirmationToken!: string | null;
  confirmedAt!: Date | null;
  resetPasswordToken!: string | null;
  resetPasswordTokenSentAt!: Date | null;
  avatarUrl!: string | null;
}
