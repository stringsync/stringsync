import { ContextFunction } from 'apollo-server-core';
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import { JwtPayload, JWT_SECRET, JWT_LIFESPAN_MS } from './getJwt';
import { UserModel } from '../models/UserModel';
import { UserTypeDef } from '../resolvers/schema';
import db from './db';
import jwt from 'jsonwebtoken';

export interface Auth {
  user?: UserTypeDef;
  isLoggedIn: boolean;
}

export interface ServerContext {
  db: typeof db;
  auth: Auth;
  requestedAt: Date;
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

  // Check jwt has been signed using JWT_SECRET
  const maybePayload = jwt.verify(token, JWT_SECRET);
  if (typeof maybePayload === 'string') {
    return null;
  }
  const payload = maybePayload as JwtPayload;

  // Check that jwt is not expired
  const issuedAt = new Date(payload.iat);
  if (isExpired(issuedAt)) {
    return null;
  }

  // Check to see if user exists in db
  const id = payload.id;
  const userRecord = await UserModel.findOne({ where: { id } });
  if (!userRecord) {
    return null;
  }

  const user: UserTypeDef = Object.freeze({
    id: userRecord.id,
    username: userRecord.username,
    email: userRecord.email,
    createdAt: userRecord.createdAt,
    updatedAt: userRecord.updatedAt,
  });
  return user;
};

export const getServerContext: ContextFunction<
  ExpressContext,
  ServerContext
> = async ({ req }) => {
  const token = req.headers.authorization || '';
  const user = await getUser(token);
  const auth = { isLoggedIn: Boolean(user), user };

  return {
    db,
    auth,
    requestedAt: new Date(),
  };
};
