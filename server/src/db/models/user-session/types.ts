import { Model, BelongsToGetAssociationMixin, BuildOptions } from 'sequelize';
import { UserModel } from '../user';

export interface RawUserSession {
  id: number;
  readonly issuedAt: Date;
  token: string;
  userId: string;
  expiresAt: Date;
}

export interface UserSessionModel extends Model, RawUserSession {
  getUser: BelongsToGetAssociationMixin<UserModel>;
}

export type UserSessionModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): UserSessionModel;
};
