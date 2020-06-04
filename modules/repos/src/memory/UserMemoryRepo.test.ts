import { UserMemoryRepo } from './UserMemoryRepo';
import { testRepo, RepoFactory, Cleanup } from '../testing';
import { User } from '@stringsync/domain';
import { noop } from '@stringsync/common';

const repoFactory: RepoFactory<User> = () => new UserMemoryRepo();

const cleanup: Cleanup<User> = noop;

testRepo(repoFactory, cleanup);
