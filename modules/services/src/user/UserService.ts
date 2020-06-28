import { ensureNoErrors } from './../dataloader-utils';
import { alignOneToOne } from '../dataloader-utils';
import Dataloader from 'dataloader';
import { UserRepo } from '@stringsync/repos';
import { User } from '@stringsync/domain';
import { injectable, inject } from 'inversify';
import { TYPES } from '@stringsync/container';

@injectable()
export class UserService {
  userRepo: UserRepo;

  private usersByIdLoader: Dataloader<string, User | null>;

  constructor(@inject(TYPES.UserRepo) userRepo: UserRepo) {
    this.userRepo = userRepo;

    this.usersByIdLoader = new Dataloader<string, User | null>(async (ids) => {
      const users = await userRepo.findAllByIds([...ids]);
      return alignOneToOne([...ids], users, {
        getKey: (user) => user.id,
        getUniqueIdentifier: (user) => user.id,
        getMissingValue: () => null,
      });
    });
  }

  async find(id: string): Promise<User | null> {
    return await this.usersByIdLoader.load(id);
  }

  async findAllByIds(ids: string[]): Promise<Array<User | null>> {
    const users = await this.usersByIdLoader.loadMany(ids);
    return ensureNoErrors(users);
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepo.findAll();
    this.prime(users);
    return users;
  }

  private prime(users: User[]) {
    for (const user of users) {
      this.usersByIdLoader.prime(user.id, user);
    }
  }
}
