import { Model } from 'sequelize';

class User extends Model {
  public id: number;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public username: string;
  public email: string;
}

export default User;
