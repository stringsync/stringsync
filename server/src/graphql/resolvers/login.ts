import { IFieldResolver } from 'apollo-server';
import { Context } from '../../util/getContext';
import UserModel from '../../models/User';
import { User } from '../type-defs/User';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../../util/getJwt';

interface Args {
  emailOrUsername: string;
  password: string;
}

const login: IFieldResolver<any, Context, Args> = (parent, args, context) => {
  const userRecord = UserModel.findOne({});
};

export default login;
