import { ContextFunction } from 'apollo-server-core';
import { getDataLoaders } from '../data-loaders/getDataLoaders';
import { Db, getAuthenticatedRawUser } from '../db';
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import { getCookies } from './getCookies';
import { RequestContext, Auth } from './types';

/**
 * This function returns a context creator that is used to create the request context
 * on each request.
 *
 * @param db
 * @param preloadedTx must use the same db object in memory as db (used for testing)
 */
export const getRequestContextCreator = (
  db: Db
): ContextFunction<ExpressContext, RequestContext> => async ({ req, res }) => {
  const requestedAt = new Date();
  const dataLoaders = getDataLoaders(db);
  const cookies = getCookies(req.headers.cookie);
  const token = cookies.USER_SESSION_TOKEN;
  const rawUser = await getAuthenticatedRawUser(db, token, requestedAt);
  const auth: Auth = { user: rawUser, isLoggedIn: Boolean(rawUser), token };

  return {
    auth,
    cookies,
    dataLoaders,
    db,
    req,
    requestedAt,
    res,
  };
};
