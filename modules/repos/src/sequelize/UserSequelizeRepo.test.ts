import { UserSequelizeRepo } from './UserSequelizeRepo';
import { testRepo, RepoFactory, Cleanup } from '../testing';
import { User } from '@stringsync/domain';
import { Db } from '@stringsync/sequelize';
import { Container, TYPES } from '@stringsync/container';

const repoFactory: RepoFactory<User> = () => {
  const db = Container.instance.get<Db>(TYPES.Db);
  return new UserSequelizeRepo(db);
};

const cleanup: Cleanup<User> = async (repo) => {
  await repo.destroyAll();
};

testRepo(repoFactory, cleanup);
