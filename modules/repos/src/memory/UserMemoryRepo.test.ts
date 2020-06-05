import { UserMemoryRepo } from './UserMemoryRepo';
import { testRepo, userFactory } from '../testing';
import { noop } from '@stringsync/common';

testRepo({
  repoFactory: () => new UserMemoryRepo(),
  entityFactory: userFactory,
  cleanup: noop,
});
