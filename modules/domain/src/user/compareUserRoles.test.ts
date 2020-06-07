import { compareUserRoles } from './compareUserRoles';
import { UserRole } from './types';

it('compares student roles', () => {
  expect(compareUserRoles(UserRole.STUDENT, UserRole.STUDENT)).toBe(0);
  expect(compareUserRoles(UserRole.STUDENT, UserRole.TEACHER)).toBe(-1);
  expect(compareUserRoles(UserRole.STUDENT, UserRole.ADMIN)).toBe(-1);
});

it('compares teacher roles', () => {
  expect(compareUserRoles(UserRole.TEACHER, UserRole.STUDENT)).toBe(1);
  expect(compareUserRoles(UserRole.TEACHER, UserRole.TEACHER)).toBe(0);
  expect(compareUserRoles(UserRole.TEACHER, UserRole.ADMIN)).toBe(-1);
});

it('compares teacher roles', () => {
  expect(compareUserRoles(UserRole.ADMIN, UserRole.STUDENT)).toBe(1);
  expect(compareUserRoles(UserRole.ADMIN, UserRole.TEACHER)).toBe(1);
  expect(compareUserRoles(UserRole.ADMIN, UserRole.ADMIN)).toBe(0);
});
