import { Db } from '../../db';
import { ContextFunction } from 'apollo-server-core';
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import { RequestContext, Auth } from './types';
import { createDataLoaders } from '../../modules/data-loaders/createDataLoaders';
import { getCookies } from './getCookies';
import { getAuthenticatedUser } from './getAuthenticatedUser';
import { createTransactionManager } from '../transaction-manager';

export const getRequestContextCreator = (
  db: Db
): ContextFunction<ExpressContext, RequestContext> => async ({ req, res }) => {
  const requestedAt = new Date();
  const cookies = getCookies(req.headers.cookie);
  const token = cookies.USER_SESSION_TOKEN;
  const user = await getAuthenticatedUser(db, undefined, {
    token,
    requestedAt,
  });
  const auth: Auth = { user, isLoggedIn: Boolean(user), token };
  const dataLoaders = createDataLoaders(db);
  const transaction = createTransactionManager(db);

  return {
    auth,
    cookies,
    dataLoaders,
    db,
    req,
    requestedAt,
    res,
    transaction,
  };
};
