import { AuthUser } from './types';
import { UserObject, UserRoles } from './../../clients';
import { toAuthUser } from './toAuthUser';
import { UserRole } from '@stringsync/domain';

it('converts a UserObject to an auth user', () => {
  const now = new Date().toJSON();

  const user: UserObject = {
    id: '1',
    createdAt: now,
    updatedAt: now,
    email: 'foo@bar.com',
    role: UserRoles.TEACHER,
    username: 'foo',
    confirmedAt: now,
  };

  const expected: AuthUser = {
    id: 1,
    email: 'foo@bar.com',
    role: UserRole.TEACHER,
    username: 'foo',
    confirmedAt: now,
  };

  const actual = toAuthUser(user);

  expect(actual).toStrictEqual(expected);
});
