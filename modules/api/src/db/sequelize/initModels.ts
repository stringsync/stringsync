import { Sequelize } from 'sequelize/types';
import { NotationModel, TaggingModel, TagModel, UserModel } from './models';

export const initModels = (sequelize: Sequelize) => {
  TaggingModel.initColumns(sequelize);
  UserModel.initColumns(sequelize);
  NotationModel.initColumns(sequelize);
  TagModel.initColumns(sequelize);

  TaggingModel.initAssociations();
  UserModel.initAssociations();
  NotationModel.initAssociations();
  TagModel.initAssociations();
};
