import { InternalError } from '../../errors';
import { UserRole } from '../../graphql';

export const toUserRole = (str: string): UserRole => {
  switch (str) {
    case UserRole.STUDENT:
      return UserRole.STUDENT;
    case UserRole.TEACHER:
      return UserRole.TEACHER;
    case UserRole.ADMIN:
      return UserRole.ADMIN;
    default:
      throw new InternalError(`invalid user role: ${str}`);
  }
};
