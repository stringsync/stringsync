import { Model, DataTypes, BuildOptions, Sequelize } from 'sequelize';

export interface RawUserSession {
  id: number;
  issuedAt: Date;
  token: string;
  userId: string;
  expiresAt: Date;
}

export interface UserSessionModel extends Model {
  id: number;
  readonly issuedAt: Date;
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
  ) as UserSessionStatic;
