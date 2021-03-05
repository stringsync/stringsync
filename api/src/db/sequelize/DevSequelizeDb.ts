import { injectable } from 'inversify';
import { NotationModel, TaggingModel, TagModel, UserModel } from './models';
import { SequelizeDb } from './SequelizeDb';

@injectable()
export class DevSequelizeDb extends SequelizeDb {
  async cleanup() {
    // Destroy is preferred over TRUNCATE table CASCADE because this
    // approach is much faster. The model ordering is intentional to
    // prevent foreign key constraints.
    await TaggingModel.destroy({ where: {} });
    await TagModel.destroy({ where: {} });
    await NotationModel.destroy({ where: {} });
    await UserModel.destroy({ where: {} });
  }
}
