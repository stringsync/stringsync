import {
  Model,
  DataTypes,
  BuildOptions,
  Sequelize,
  BelongsToGetAssociationMixin,
  BelongsToCreateAssociationMixin,
} from 'sequelize';
import { UserModel } from './defineUserModel';

export interface UserSessionModel extends Model {
  id: number;
  readonly issuedAt: Date;
  token: string;
  userId: string;
  expiresAt: Date;

  getUser: BelongsToGetAssociationMixin<UserModel>;
}

export type UserSessionModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): UserSessionModel;
};

export const defineUserSessionModel = (dbConnection: Sequelize) =>
  dbConnection.define(
    'UserSession',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      issuedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      token: {
        type: DataTypes.UUIDV4,
        allowNull: true, // db sets this field
      },
      userId: {
        type: DataTypes.TEXT,
        references: {
          model: 'user',
          key: 'id',
        },
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      underscored: true,
      tableName: 'user_sessions',
      timestamps: false,
    }
  ) as UserSessionModelStatic;
