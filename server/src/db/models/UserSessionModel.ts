import { Model, DataTypes, BuildOptions, Sequelize } from 'sequelize';

export interface RawUserSession {
  id: number;
  token: string;
  userId: string;
  expiredAt: Date;
}

export interface UserSessionModel extends Model {
  id: number;
  token: string;
  userId: string;
  expiresAt: Date;
}

export type UserSessionStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): UserSessionModel;
};

export const defineUserSessionModel = (dbConnection: Sequelize) =>
  dbConnection.define(
    'userSession',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
      timestamps: false,
      tableName: 'user_sessions',
    }
  ) as UserSessionStatic;
