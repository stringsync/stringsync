import { IFieldResolver } from 'apollo-server';
import { UserInput } from '../type-defs/User';
import { Context } from '../../util/getContext';
import User from '../../models/User';

interface Args {
  input: UserInput;
}

const signup: IFieldResolver<any, Context, Args> = (parent, args) => {
  return User.create({ ...args.input });
};

export default signup;
