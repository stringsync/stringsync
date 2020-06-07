import { UserTypeormRepo } from './UserTypeormRepo';
import { testRepo } from '../testing';
import { buildUser } from '@stringsync/domain';
import { Connection } from 'typeorm';
import { TYPES, createContainer, cleanupContainer } from '@stringsync/container';
import { User } from '@stringsync/typeorm';
import { Container } from 'inversify';

let container: Container | undefined;

beforeEach(async () => {
  container = await createContainer();
});

afterEach(async () => {
  if (container) {
    await cleanupContainer(container);
  }
  container = undefined;
});

testRepo({
  repoFactory: async () => {
    if (!container) {
      throw Error('no container found');
    }
    const connection = container.get<Connection>(TYPES.Connection);
    return new UserTypeormRepo(connection, User);
  },
  entityFactory: buildUser,
  cleanup: async (repo) => {
    await repo.destroyAll();
  },
});
