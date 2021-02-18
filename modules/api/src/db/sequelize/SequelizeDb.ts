import { createNamespace } from 'cls-hooked';
import { inject, injectable } from 'inversify';
import { Sequelize } from 'sequelize';
import { Config } from '../../config';
import { TYPES } from '../../inversify.constants';
import { Logger } from '../../util';
import { Db, Task } from './../types';
import { initModels } from './initModels';

const namespace = createNamespace('transaction');
Sequelize.useCLS(namespace);

@injectable()
export class SequelizeDb implements Db {
  sequelize: Sequelize;

  constructor(@inject(TYPES.Logger) logger: Logger, @inject(TYPES.Config) config: Config) {
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

  async transaction(task: Task) {
    await this.sequelize.transaction(task);
  }

  async teardown() {
    await this.sequelize.close();
  }
}
