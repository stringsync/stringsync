import { UserLoader } from '../../types';
import Dataloader from 'dataloader';
import { TYPES } from '@stringsync/container';
import { UserModel } from '@stringsync/sequelize';
import { inject, injectable } from 'inversify';
import { User } from '@stringsync/domain';
import { alignOneToOne, ensureNotError } from '../../dataloader-utils';

@injectable()
export class UserSequelizeLoader implements UserLoader {
  userModel: typeof UserModel;

  byIdLoader: Dataloader<string, User | null>;

  constructor(@inject(TYPES.UserModel) userModel: typeof UserModel) {
    this.userModel = userModel;

    this.byIdLoader = new Dataloader(this.loadAllById.bind(this));
  }

  primeById(id: string, user: User | null) {
    this.byIdLoader.prime(id, user);
  }

  clearById(id: string) {
    this.byIdLoader.clear(id);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.byIdLoader.load(id);
    return ensureNotError(user);
  }

  private async loadAllById(ids: readonly string[]): Promise<Array<User | null>> {
    const users: User[] = await this.userModel.findAll({ where: { id: [...ids] }, raw: true });
    return alignOneToOne([...ids], users, {
      getKey: (user) => user.id,
      getUniqueIdentifier: (user) => user.id,
      getMissingValue: () => null,
    });
  }
}
