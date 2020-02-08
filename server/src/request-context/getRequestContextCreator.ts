import { Auth, RequestContext } from './types';
import { getAuthenticatedUser } from '../db';
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import { getCookies } from './getCookies';
import { getDataLoaders } from '../data-loaders/getDataLoaders';
import { GlobalCtx } from '../ctx';

/**
 * This function returns a context creator that is used to create the request context
 * on each request.
 */
export const getRequestContextCreator = (globalCtx: GlobalCtx) => async <
  E extends ExpressContext
>(
  expressCtx: E,
  requestedAt?: Date // used for testing
): Promise<RequestContext<E>> => {
  requestedAt = requestedAt || new Date();
  const { req, res } = expressCtx;
  const dataLoaders = getDataLoaders(globalCtx.db);
  const cookies = getCookies(req.headers.cookie);
  const token = cookies.USER_SESSION_TOKEN;
  const rawUser = await getAuthenticatedUser(globalCtx.db, token, requestedAt);
  const auth: Auth = { user: rawUser, isLoggedIn: Boolean(rawUser), token };

  return {
    requestedAt,
    auth,
    cookies,
    dataLoaders,
    req,
    res,
    ...globalCtx,
  };
};
