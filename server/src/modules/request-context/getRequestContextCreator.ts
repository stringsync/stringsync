import { Db } from '../../db';
import { ContextFunction } from 'apollo-server-core';
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import { RequestContext, Auth } from './types';
import { createDataLoaders } from '../../modules/data-loaders/createDataLoaders';
import { getCookies } from './getCookies';
import { getAuthenticatedUser } from './getAuthenticatedUser';

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
  const user = await getAuthenticatedUser(db, undefined, {
    token,
    requestedAt,
  });
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
