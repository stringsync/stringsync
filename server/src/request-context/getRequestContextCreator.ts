import { ContextFunction } from 'apollo-server-core';
import { createDataLoaders } from '../data-loaders/createDataLoaders';
import { Db, getAuthenticatedUser } from '../db';
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
  const dataLoaders = createDataLoaders(db);
  const cookies = getCookies(req.headers.cookie);
  const token = cookies.USER_SESSION_TOKEN;
  const user = await getAuthenticatedUser(db, token, requestedAt);
  const auth: Auth = { user, isLoggedIn: Boolean(user), token };

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
