import { UserRoles } from 'common/types';
import { Model, HasManyCreateAssociationMixin, BuildOptions } from 'sequelize';
import { UserSessionModel } from '../user-session';

export const USER_ROLES: UserRoles[] = ['student', 'teacher', 'admin'];

export interface RawUser {
  id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  username: string;
  email: string;
  encryptedPassword: string;
  role: UserRoles;
  confirmationToken: string;
  confirmedAt: Date;
  resetPasswordToken: string;
  resetPasswordTokenSentAt: Date;
  avatarUrl: string;
}

export interface UserModel extends Model, RawUser {
  createUserSession: HasManyCreateAssociationMixin<UserSessionModel>;
}

export type UserModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): UserModel;
};
