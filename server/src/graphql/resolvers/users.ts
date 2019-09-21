import { IFieldResolver } from 'apollo-server';
import { Context } from '../../util/getContext';
import { User } from '../type-defs/User';

interface Args {}

const users: IFieldResolver<any, Context, Args> = (parent, args, context) => {};

export default users;
