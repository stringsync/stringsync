import UserModel from '../../models/User';
import { FieldResolver } from '..';
import { UserTypeDef } from '../schema';

const users: FieldResolver<UserTypeDef[]> = (parent) => {
  return UserModel.findAll();
};

export default users;
