/* eslint-disable @typescript-eslint/member-ordering */
import { Tag } from '@stringsync/domain';
import { Association, DataTypes, Model, Sequelize } from 'sequelize';
import { TaggingModel } from '.';
import { NotationModel } from './NotationModel';

export class TagModel extends Model<Tag, Partial<Tag>> implements Tag {
  static initColumns(sequelize: Sequelize) {
    TagModel.init(
      {
        id: {
          type: DataTypes.TEXT,
          primaryKey: true,
          allowNull: false,
          unique: true,
        },
        name: {
          type: DataTypes.TEXT,
          allowNull: false,
          unique: true,
        },
      },
      {
        sequelize,
        tableName: 'tags',
        modelName: 'Tag',
        timestamps: false,
        underscored: true,
      }
    );
  }

  static initAssociations() {
    TagModel.belongsToMany(NotationModel, { through: TaggingModel as any, uniqueKey: 'id', as: 'notations' });
    TagModel.hasMany(TaggingModel, { foreignKey: 'tagId', as: 'taggings' });
  }

  static associations: {
    notations: Association<TagModel, NotationModel>;
    taggings: Association<TagModel, TaggingModel>;
  };

  notations?: NotationModel[];
  taggings?: TaggingModel[];

  id!: string;
  name!: string;
}
