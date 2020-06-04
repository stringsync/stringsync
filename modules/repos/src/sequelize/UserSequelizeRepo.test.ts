import { Container, TYPES } from '@stringsync/container';
import { Db } from '@stringsync/sequelize';
import { testRepo, userFactory } from '../testing';
import { UserSequelizeRepo } from './UserSequelizeRepo';

testRepo({
  repoFactory: () => {
    const db = Container.instance.get<Db>(TYPES.Db);
    return new UserSequelizeRepo(db);
  },
  entityFactory: userFactory,
  cleanup: async (repo) => {
    await repo.destroyAll();
  },
});
