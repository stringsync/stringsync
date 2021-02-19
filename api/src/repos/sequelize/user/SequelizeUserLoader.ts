import Dataloader from 'dataloader';
import { injectable } from 'inversify';
import { UserModel } from '../../../db';
import { User } from '../../../domain';
import { alignOneToOne, ensureNoErrors } from '../../../util';
import { UserLoader } from '../../types';

@injectable()
export class SequelizeUserLoader implements UserLoader {
  byIdLoader: Dataloader<string, User | null>;

  constructor() {
    this.byIdLoader = new Dataloader(this.loadAllById);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.byIdLoader.load(id);
    this.byIdLoader.clearAll();
    return ensureNoErrors(user);
  }

  private loadAllById = async (ids: readonly string[]): Promise<Array<User | null>> => {
    const users: User[] = await UserModel.findAll({ where: { id: [...ids] }, raw: true });
    return alignOneToOne([...ids], users, {
      getKey: (user) => user.id,
      getUniqueIdentifier: (user) => user.id,
      getMissingValue: () => null,
    });
  };
}
