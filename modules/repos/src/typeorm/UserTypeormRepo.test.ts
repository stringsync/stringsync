import { UserTypeormRepo } from './UserTypeormRepo';
import { testRepo } from '../testing';
import { buildUser } from '@stringsync/domain';
import { Connection } from 'typeorm';
import { TYPES, createContainer, cleanupContainer } from '@stringsync/container';
import { Container } from 'inversify';

let container: Container;

beforeEach(async () => {
  container = await createContainer();
});

afterEach(async () => {
  await cleanupContainer(container);
});

testRepo({
  repoFactory: async () => {
    const connection = container.get<Connection>(TYPES.Connection);
    return new UserTypeormRepo(connection);
  },
  entityFactory: buildUser,
  cleanup: async () => {
    const connection = container.get<Connection>(TYPES.Connection);
    await connection.synchronize(true);
  },
});
