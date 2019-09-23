import {
  ContextFunction,
  UserInputError,
  AuthenticationError,
} from 'apollo-server-core';
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import db from './db';
import { User } from '../graphql/type-defs/User';
import UserModel from '../models/User';
import { JwtPayload, JWT_SECRET, JWT_LIFESPAN_MS } from './getJwt';
import jwt from 'jsonwebtoken';

export interface Context {
  db: typeof db;
  auth: {
    isLoggedIn: boolean;
    user?: User;
  };
  requestedAt: Date;
}

export interface AuthenticatedUser extends User {
  isLoggedIn: boolean;
}

export const isExpired = (issuedAt: Date) => {
  const expiresAt = new Date(issuedAt.getTime() + JWT_LIFESPAN_MS);
  const now = new Date();
  return expiresAt < now;
};

export const getUser = async (token: string) => {
  if (!token) {
    return null;
  }

  const maybePayload = jwt.verify(token, JWT_SECRET);
  if (typeof maybePayload === 'string') {
    throw new AuthenticationError('must reauthenticate');
  }
  const payload = maybePayload as JwtPayload;

  const issuedAt = new Date(payload.iat);
  if (isExpired(issuedAt)) {
    throw new AuthenticationError('must reauthenticate');
  }

  const id = payload.id;
  const userRecord = await UserModel.findOne({ where: { id } });
  if (!userRecord) {
    throw new AuthenticationError('must reauthenticate');
  }

  const user: User = Object.freeze({
    id: userRecord.id,
    username: userRecord.username,
    email: userRecord.email,
    createdAt: userRecord.createdAt,
    jwt: undefined,
  });
  return user;
};

export const getContext: ContextFunction<ExpressContext, Context> = async ({
  req,
}) => {
  const token = req.headers.authorization || '';
  const user = await getUser(token);
  const auth = { isLoggedIn: Boolean(user), user };

  return {
    db,
    auth,
    requestedAt: new Date(),
  };
};

export default getContext;
