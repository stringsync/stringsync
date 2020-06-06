import { UserTypeormRepo } from './UserTypeormRepo';
import { testRepo } from '../testing';
import { buildUser } from '@stringsync/domain';
import { User } from '@stringsync/typeorm';
import { Container, TYPES } from '@stringsync/container';
import { Connection } from 'typeorm';
import { noop } from '@stringsync/common';

testRepo({
  repoFactory: async () => {
    const container = await Container.instance();
    const connection = container.get<Connection>(TYPES.Connection);
    return new UserTypeormRepo(connection, User);
  },
  entityFactory: buildUser,
  cleanup: async (repo) => {
    await repo.destroyAll();
  },
});
