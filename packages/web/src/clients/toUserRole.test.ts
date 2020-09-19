import { UserRole as DomainUserRole } from '@stringsync/domain';
import { UserRoles as TypegenUserRole } from './graphqlTypes';
import { toUserRole } from './toUserRole';

it.each([
  { typegenType: TypegenUserRole.STUDENT, domainType: DomainUserRole.STUDENT },
  { typegenType: TypegenUserRole.TEACHER, domainType: DomainUserRole.TEACHER },
  { typegenType: TypegenUserRole.ADMIN, domainType: DomainUserRole.ADMIN },
])('converts typegen UserRoles to domain UserRoles', (t) => {
  const userRole = toUserRole(t.typegenType);
  expect(userRole).toBe(t.domainType);
});
