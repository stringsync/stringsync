import { Sequelize } from 'sequelize-typescript';
import { ContainerConfig } from '@stringsync/config';
import { ContainerModule } from 'inversify';
import { TYPES } from './constants';
import { Db, UserModel, NotationModel, TagModel, TaggingModel } from '@stringsync/sequelize';
import { Logger } from './Logger';

export const getSequelizeModule = (config: ContainerConfig, logger: Logger) =>
  new ContainerModule((bind) => {
    const sequelize = Db.connect({
      database: config.DB_NAME,
      host: config.DB_HOST,
      port: config.DB_PORT,
      password: config.DB_PASSWORD,
      username: config.DB_USERNAME,
      logging: logger.info,
    });
    bind<Sequelize>(TYPES.Sequelize).toConstantValue(sequelize);
    bind<typeof UserModel>(TYPES.UserModel).toConstructor(UserModel);
    bind<typeof NotationModel>(TYPES.NotationModel).toConstructor(NotationModel);
    bind<typeof TagModel>(TYPES.TagModel).toConstructor(TagModel);
    bind<typeof TaggingModel>(TYPES.TaggingModel).toConstructor(TaggingModel);
  });
