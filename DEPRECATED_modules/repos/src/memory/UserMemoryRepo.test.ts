import { UserMemoryRepo } from './UserMemoryRepo';
import { testRepo } from '../testing';
import { noop } from '@stringsync/common';
import { buildUser } from '@stringsync/domain';

testRepo({
  repoFactory: () => new UserMemoryRepo(),
  entityFactory: buildUser,
  cleanup: noop,
});
