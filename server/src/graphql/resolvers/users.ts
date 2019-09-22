import { IFieldResolver } from 'apollo-server';
import { Context } from '../../util/getContext';
import User from '../../models/User';

interface Args {}

const users: IFieldResolver<any, Context, Args> = (parent, args, context) => {
  return User.findAll();
};

export default users;
