import { UserRole as DomainUserRole } from '../../domain';
import { UserObject, UserRoles as TypegenUserRole } from './../../clients';
import { toAuthUser } from './toAuthUser';
import { AuthUser } from './types';

describe('toAuthUser', () => {
  it('converts a UserObject to an AuthUser', () => {
    const now = new Date().toJSON();

    const user: UserObject = {
      id: 'asdfasdf',
      createdAt: now,
      updatedAt: now,
      email: 'foo@bar.com',
      role: TypegenUserRole.TEACHER,
      username: 'foo',
      confirmedAt: now,
    };

    const expected: AuthUser = {
      id: 'asdfasdf',
      email: 'foo@bar.com',
      role: DomainUserRole.TEACHER,
      username: 'foo',
      confirmedAt: now,
    };

    const actual = toAuthUser(user);

    expect(actual).toStrictEqual(expected);
  });
});
