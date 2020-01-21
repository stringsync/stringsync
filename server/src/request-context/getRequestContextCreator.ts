import { getDataLoaders } from '../data-loaders/getDataLoaders';
import { Db, getAuthenticatedUser } from '../db';
import { getCookies } from './getCookies';
import { Auth, RequestContext } from './types';
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import { Logger } from 'winston';

/**
 * This function returns a context creator that is used to create the request context
 * on each request.
 */
export const getRequestContextCreator = (db: Db, logger: Logger) => async <
  E extends ExpressContext
>(
  expressCtx: E,
  requestedAt?: Date // used for testing
): Promise<RequestContext<E>> => {
  requestedAt = requestedAt || new Date();
  const { req, res } = expressCtx;
  const dataLoaders = getDataLoaders(db);
  const cookies = getCookies(req.headers.cookie);
  const token = cookies.USER_SESSION_TOKEN;
  const rawUser = await getAuthenticatedUser(db, token, requestedAt);
  const auth: Auth = { user: rawUser, isLoggedIn: Boolean(rawUser), token };

  return {
    requestedAt,
    auth,
    cookies,
    dataLoaders,
    db,
    req,
    res,
  };
};
