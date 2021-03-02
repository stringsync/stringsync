/* eslint-disable @typescript-eslint/member-ordering */
import { Association, DataTypes, Model, Sequelize } from 'sequelize';
import { Notation, NotationStatuses } from '../../../domain';
import { TaggingModel } from './TaggingModel';
import { TagModel } from './TagModel';
import { UserModel } from './UserModel';

export class NotationModel extends Model<Notation, Partial<Notation>> implements Notation {
  static initColumns(sequelize: Sequelize) {
    NotationModel.init(
      {
        id: {
          type: DataTypes.TEXT,
          primaryKey: true,
          unique: true,
        },
        createdAt: {
          type: DataTypes.DATE,
        },
        updatedAt: {
          type: DataTypes.DATE,
        },
        status: {
          type: DataTypes.ENUM(NotationStatuses.DRAFT, NotationStatuses.PUBLISH),
          defaultValue: NotationStatuses.DRAFT,
          allowNull: false,
        },
        songName: {
          type: DataTypes.TEXT,
          allowNull: false,
          unique: false,
          validate: {
            is: /^[A-Za-z0-9!?\s()']*$/,
            len: [1, 64],
          },
        },
        artistName: {
          type: DataTypes.TEXT,
          allowNull: false,
          unique: false,
          validate: {
            is: /^[A-Za-z0-9!?\s()@']*$/,
            len: [1, 64],
          },
        },
        deadTimeMs: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
          allowNull: false,
          unique: false,
        },
        durationMs: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
          allowNull: false,
          unique: false,
          validate: {
            min: 0,
          },
        },
        private: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
          allowNull: false,
          unique: false,
        },
        transcriberId: {
          type: DataTypes.TEXT,
          allowNull: false,
          unique: false,
        },
        cursor: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
        },
        thumbnailUrl: {
          type: DataTypes.TEXT,
          allowNull: true,
          unique: false,
        },
        videoUrl: {
          type: DataTypes.TEXT,
          allowNull: true,
          unique: false,
        },
      },
      {
        sequelize,
        tableName: 'notations',
        modelName: 'notation',
        underscored: true,
      }
    );
  }

  static initAssociations() {
    NotationModel.belongsTo(UserModel, { foreignKey: 'transcriberId', as: 'transcriber' });
    NotationModel.hasMany(TaggingModel, { foreignKey: 'notationId', as: 'taggings' });
    NotationModel.belongsToMany(TagModel, { through: TaggingModel as any, uniqueKey: 'id', as: 'tags' });
  }

  static associations: {
    transcriber: Association<NotationModel, UserModel>;
    tags: Association<NotationModel, TagModel>;
    taggings: Association<NotationModel, TaggingModel>;
  };

  transcriber?: UserModel;
  tags?: TagModel[];
  taggings?: TaggingModel[];

  id!: string;
  createdAt!: Date;
  updatedAt!: Date;
  status!: NotationStatuses;
  songName!: string;
  artistName!: string;
  deadTimeMs!: number;
  durationMs!: number;
  private!: boolean;
  transcriberId!: string;
  cursor!: number;
  thumbnailUrl!: string | null;
  videoUrl!: string | null;
}
