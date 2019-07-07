import * as jwt from 'jsonwebtoken';
import { Prisma } from '../prisma/generated/prisma-client';
import { IResolverObject } from 'graphql-tools';

export interface Context {
  prisma: Prisma;
  request: any;
}

export type ResolverObject = IResolverObject<any, Context>;

export interface IUserID {
  userId: string;
}

export const getAppSecret = () => {
  const appSecret = process.env.APP_SECRET;
  if (!appSecret) {
    throw new AppSecretError();
  }
  return appSecret;
};

export const getUserId = (ctx: Context) => {
  const Authorization = ctx.request.get('Authorization');
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '');
    const appSecret = getAppSecret();
    const { userId } = jwt.verify(token, appSecret) as IUserID;
    return userId;
  }

  throw new AuthError();
};

export class AuthError extends Error {
  constructor() {
    super('Not authorized');
  }
}

export class AppSecretError extends Error {
  constructor() {
    super('App secret not set');
  }
}
