import { UserLoader } from '../../types';
import Dataloader from 'dataloader';
import { TYPES } from '@stringsync/container';
import { UserModel } from '@stringsync/sequelize';
import { inject, injectable } from 'inversify';
import { User } from '@stringsync/domain';
import { alignOneToOne, ensureNoErrors } from '../../dataloader-utils';

@injectable()
export class UserSequelizeLoader implements UserLoader {
  userModel: typeof UserModel;

  byIdLoader: Dataloader<string, User | null>;

  constructor(@inject(TYPES.UserModel) userModel: typeof UserModel) {
    this.userModel = userModel;

    this.byIdLoader = new Dataloader(this.loadAllById.bind(this));
  }

  startListeningForChanges() {
    this.userModel.emitter.addListener(this.userModel.PRIME_CACHE, this.prime);
    this.userModel.emitter.addListener(this.userModel.CLEAR_CACHE, this.clear);
  }

  stopListeningForChanges() {
    this.userModel.emitter.removeListener(this.userModel.PRIME_CACHE, this.prime);
    this.userModel.emitter.removeListener(this.userModel.CLEAR_CACHE, this.clear);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.byIdLoader.load(id);
    return ensureNoErrors(user);
  }

  private async loadAllById(ids: readonly string[]): Promise<Array<User | null>> {
    const users: User[] = await this.userModel.findAll({ where: { id: [...ids] }, raw: true });
    return alignOneToOne([...ids], users, {
      getKey: (user) => user.id,
      getUniqueIdentifier: (user) => user.id,
      getMissingValue: () => null,
    });
  }

  private prime = (id: string, user: User) => {
    this.byIdLoader.prime(id, user);
  };

  private clear = (id: string) => {
    this.byIdLoader.clear(id);
  };
}
