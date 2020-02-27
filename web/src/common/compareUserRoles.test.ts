import { compareUserRoles } from './compareUserRoles';
import { UserRoles } from '../common/types';

it.each([
  {
    role1: 'student',
    role2: 'student',
    expectation: 0,
  },
  {
    role1: 'student',
    role2: 'teacher',
    expectation: -1,
  },
  {
    role1: 'student',
    role2: 'admin',
    expectation: -1,
  },
  {
    role1: 'teacher',
    role2: 'student',
    expectation: 1,
  },
  {
    role1: 'teacher',
    role2: 'teacher',
    expectation: 0,
  },
  {
    role1: 'teacher',
    role2: 'admin',
    expectation: -1,
  },
  {
    role1: 'admin',
    role2: 'student',
    expectation: 1,
  },
  {
    role1: 'admin',
    role2: 'teacher',
    expectation: 1,
  },
  {
    role1: 'admin',
    role2: 'admin',
    expectation: 0,
  },
] as Array<{
  role1: UserRoles;
  role2: UserRoles;
  expectation: -1 | 0 | 1;
}>)('compares roles', ({ role1, role2, expectation }) => {
  const comparison = compareUserRoles(role1, role2);
  expect(comparison).toBe(expectation);
});
