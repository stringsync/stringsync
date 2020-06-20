import { AuthUser } from './types';
import { UserObject, UserRoles as TypegenUserRole } from './../../clients';
import { toAuthUser } from './toAuthUser';
import { UserRole as DomainUserRole } from '@stringsync/domain';

it('converts a UserObject to an AuthUser', () => {
  const now = new Date().toJSON();

  const user: UserObject = {
    id: '1',
    createdAt: now,
    updatedAt: now,
    email: 'foo@bar.com',
    role: TypegenUserRole.TEACHER,
    username: 'foo',
    confirmedAt: now,
  };

  const expected: AuthUser = {
    id: 1,
    email: 'foo@bar.com',
    role: DomainUserRole.TEACHER,
    username: 'foo',
    confirmedAt: now,
  };

  const actual = toAuthUser(user);

  expect(actual).toStrictEqual(expected);
});
