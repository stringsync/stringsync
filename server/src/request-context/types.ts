import { Db, RawUser } from '../db';
import { getDataLoaders } from '../data-loaders';
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';

export interface Auth {
  user: RawUser | null;
  isLoggedIn: boolean;
  token: string;
}

export type Cookies = {
  USER_SESSION_TOKEN: string;
};

export interface RequestContext<E extends ExpressContext = ExpressContext> {
  requestedAt: Date;
  auth: Auth;
  cookies: Cookies;
  dataLoaders: ReturnType<typeof getDataLoaders>;
  db: Db;
  req: E['req'];
  res: E['res'];
}
