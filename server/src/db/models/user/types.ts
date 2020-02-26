import { UserRoles } from '../../../common/types';
import { Model, HasManyCreateAssociationMixin } from 'sequelize';
import { UserSessionModel } from '../user-session';

export interface RawUser {
  id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  username: string;
  email: string;
  encryptedPassword: string;
  role: UserRoles;
  confirmationToken: string | null;
  confirmedAt: Date | null;
  resetPasswordToken: string | null;
  resetPasswordTokenSentAt: Date | null;
  avatarUrl: string | null;
}

export interface UserModel extends Model, RawUser {
  createUserSession: HasManyCreateAssociationMixin<UserSessionModel>;
}
