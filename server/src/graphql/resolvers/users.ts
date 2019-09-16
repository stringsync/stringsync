import { IFieldResolver } from 'apollo-server';
import { Context } from '../../';
import { User } from '../type-defs/User';

interface Args {}

const users: IFieldResolver<any, Context, Args> = (parent, args, context) =>
  context.prisma.users();

export default users;
