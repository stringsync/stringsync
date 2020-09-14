import { UserModel } from '@stringsync/db';
import { User } from '@stringsync/domain';
import Dataloader from 'dataloader';
import { injectable } from 'inversify';
import { UserLoader } from '../../types';
import { alignOneToOne, ensureNoErrors } from '../../util';

@injectable()
export class UserSequelizeLoader implements UserLoader {
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
