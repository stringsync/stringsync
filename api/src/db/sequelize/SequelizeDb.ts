import { createNamespace } from 'cls-hooked';
import { inject, injectable } from 'inversify';
import { Sequelize } from 'sequelize';
import { Config } from '../../config';
import { TYPES } from '../../inversify.constants';
import { Logger } from '../../util';
import { Db, Task } from './../types';
import { initModels } from './initModels';
import { NotationModel, TaggingModel, TagModel, UserModel } from './models';

const namespace = createNamespace('transaction');
Sequelize.useCLS(namespace);

@injectable()
export class SequelizeDb extends Db {
  sequelize: Sequelize;

  constructor(@inject(TYPES.Logger) logger: Logger, @inject(TYPES.Config) config: Config) {
    super();
    const sequelize = new Sequelize({
      dialect: 'postgres',
      host: config.DB_HOST,
      port: config.DB_PORT,
      database: config.DB_NAME,
      username: config.DB_USERNAME,
      password: config.DB_PASSWORD,
      logging: (sql: string) => logger.debug(sql),
    });

    initModels(sequelize);

    this.sequelize = sequelize;
  }

  async doCleanup() {
    // Destroy is preferred over TRUNCATE table CASCADE because this
    // approach is much faster. The model ordering is intentional to
    // prevent foreign key constraints.
    await TaggingModel.destroy({ where: {} });
    await TagModel.destroy({ where: {} });
    await NotationModel.destroy({ where: {} });
    await UserModel.destroy({ where: {} });
  }

  async transaction(task: Task) {
    await this.sequelize.transaction(task);
  }

  async closeConnection() {
    await this.sequelize.close();
  }
}
