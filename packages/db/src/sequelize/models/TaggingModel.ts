/* eslint-disable @typescript-eslint/member-ordering */
import { Tagging } from '@stringsync/domain';
import { Sequelize, Model, DataTypes, Association, BelongsToGetAssociationMixin } from 'sequelize';
import { NotationModel } from './NotationModel';
import { TagModel } from './TagModel';

export class TaggingModel extends Model<Tagging, Partial<Tagging>> implements Tagging {
  static initColumns(sequelize: Sequelize) {
    TaggingModel.init(
      {
        id: {
          type: DataTypes.TEXT,
          primaryKey: true,
          allowNull: false,
          unique: true,
        },
        notationId: {
          type: DataTypes.TEXT,
          allowNull: false,
          key: 'id',
        },
        tagId: {
          type: DataTypes.TEXT,
          allowNull: false,
          key: 'id',
        },
      },
      {
        sequelize,
        tableName: 'taggings',
        modelName: 'Tagging',
        timestamps: false,
        underscored: true,
      }
    );
  }

  static initAssociations() {
    TaggingModel.belongsTo(TagModel, { foreignKey: 'tagId', as: 'tag' });
    TaggingModel.belongsTo(NotationModel, { foreignKey: 'notationId', as: 'notation' });
  }

  static associations: {
    tag: Association<TaggingModel, TagModel>;
    notation: Association<TaggingModel, NotationModel>;
  };

  getTag!: BelongsToGetAssociationMixin<TagModel>;
  getNotation!: BelongsToGetAssociationMixin<NotationModel>;

  tag?: TagModel;
  notation?: NotationModel;

  id!: string;
  notationId!: string;
  tagId!: string;
}
