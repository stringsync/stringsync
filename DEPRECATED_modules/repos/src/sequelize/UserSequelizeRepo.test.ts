import { Container, TYPES } from '@stringsync/container';
import { Db } from '@stringsync/sequelize';
import { testRepo } from '../testing';
import { UserSequelizeRepo } from './UserSequelizeRepo';
import { buildUser } from '@stringsync/domain';

testRepo({
  repoFactory: () => {
    const db = Container.instance.get<Db>(TYPES.Db);
    return new UserSequelizeRepo(db);
  },
  entityFactory: buildUser,
  cleanup: async (repo) => {
    await repo.destroyAll();
  },
});
