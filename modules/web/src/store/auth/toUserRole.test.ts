import { UserRole } from '@stringsync/domain';
import { UserRoles } from './../../clients/graphqlTypes';
import { toUserRole } from './toUserRole';

it.each([
  { graphqlType: UserRoles.STUDENT, domainType: UserRole.STUDENT },
  { graphqlType: UserRoles.TEACHER, domainType: UserRole.TEACHER },
  { graphqlType: UserRoles.ADMIN, domainType: UserRole.ADMIN },
])('converts graphQL types to domain types', (t) => {
  const userRole = toUserRole(t.graphqlType);
  expect(userRole).toBe(t.domainType);
});
