import { User } from '@stringsync/domain';
import { UserRepo, UserSequelizeRepo } from '@stringsync/repos';
import { NotationSequelizeRepo } from './NotationSequelizeRepo';
import { randStr, buildRandNotation, buildRandUser } from '@stringsync/common';
import { NotationModel, UserModel } from '@stringsync/sequelize';
import { NotationRepo } from './../types';
import { useTestContainer, TYPES } from '@stringsync/container';
import { sortBy, isPlainObject } from 'lodash';

const container = useTestContainer();

let notationModel: typeof NotationModel;
let notationRepo: NotationRepo;

let userModel: typeof UserModel;
let userRepo: UserRepo;
let user: User;

beforeEach(async () => {
  notationModel = container.get<typeof NotationModel>(TYPES.NotationModel);
  notationRepo = new NotationSequelizeRepo(notationModel);

  userModel = container.get<typeof UserModel>(TYPES.UserModel);
  userRepo = new UserSequelizeRepo(userModel);
  user = await userRepo.create(buildRandUser());
});

describe('count', () => {
  it('counts the number of notations', async () => {
    const transcriberId = user.id;
    await notationRepo.bulkCreate([
      buildRandNotation({ transcriberId }),
      buildRandNotation({ transcriberId }),
      buildRandNotation({ transcriberId }),
    ]);
    const count = await notationRepo.count();
    expect(count).toBe(3);
  });
});
