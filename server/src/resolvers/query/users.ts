import UserModel from '../../models/UserModel';
import { FieldResolver } from '..';
import { UserTypeDef } from '../schema';

const users: FieldResolver<UserTypeDef[]> = (parent) => {
  return UserModel.findAll();
};

export default users;
