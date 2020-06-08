import { UserMemoryRepo } from './UserMemoryRepo';
import { testUserRepo } from '../testing';
import { buildUser } from '@stringsync/domain';
import { noop } from '@stringsync/common';

testUserRepo({
  repoFactory: () => new UserMemoryRepo(),
  entityFactory: buildUser,
  cleanup: noop,
});
