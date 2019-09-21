import { Model } from 'sequelize';

export type UserProvider = 'email';

class User extends Model {
  public uid: string;
  public provider: UserProvider;
  public username: string;
  public email: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
}

export default User;
