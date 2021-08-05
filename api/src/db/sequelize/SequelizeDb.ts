import { createNamespace } from 'cls-hooked';
import { inject, injectable } from 'inversify';
import { QueryTypes, Sequelize } from 'sequelize';
import { Config } from '../../config';
import { NotImplementedError } from '../../errors';
import { TYPES } from '../../inversify.constants';
import { camelCaseKeys } from '../../repos/queries';
import { Logger } from '../../util';
import { Db, Orm, Task } from './../types';
import { NotationModel, TaggingModel, TagModel, UserModel } from './models';

const namespace = createNamespace('transaction');
Sequelize.useCLS(namespace);

@injectable()
export class SequelizeDb implements Db {
  sequelize: Sequelize;

  constructor(@inject(TYPES.Logger) private logger: Logger, @inject(TYPES.Config) private config: Config) {
    const sequelize = new Sequelize({
      dialect: 'postgres',
      host: this.config.DB_HOST,
      port: this.config.DB_PORT,
      database: this.config.DB_NAME,
      username: this.config.DB_USERNAME,
      password: this.config.DB_PASSWORD,
      logging: (sql: string) => this.logger.debug(sql),
    });

    this.sequelize = sequelize;
  }

  async init() {
    TaggingModel.initColumns(this.sequelize);
    UserModel.initColumns(this.sequelize);
    NotationModel.initColumns(this.sequelize);
    TagModel.initColumns(this.sequelize);

    TaggingModel.initAssociations();
    UserModel.initAssociations();
    NotationModel.initAssociations();
    TagModel.initAssociations();
  }

  async transaction(task: Task) {
    await this.sequelize.transaction(async () => {
      await task({ type: Orm.Sequelize });
    });
  }

  async closeConnection() {
    await this.sequelize.close();
  }

  async query<T = unknown>(sql: string): Promise<T[]> {
    const rows = await this.sequelize.query(sql, { type: QueryTypes.SELECT });
    return camelCaseKeys<T>(rows);
  }

  async checkHealth(): Promise<boolean> {
    try {
      await this.sequelize.authenticate();
      return true;
    } catch (err) {
      this.logger.error(err.message);
      return false;
    }
  }

  async cleanup(): Promise<void> {
    throw new NotImplementedError('cannot cleanup db');
  }
}
