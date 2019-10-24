import { Db } from '../../db/createDb';
import { ContextFunction } from 'apollo-server-core';
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import { RequestContext } from './types';
import { createDataLoaders } from '../../modules/data-loaders/createDataLoaders';
import { getCookies } from './getCookies';
import { getAuth } from './getAuth';

type RequestContextCreator = ContextFunction<ExpressContext, RequestContext>;

export const getRequestContextCreator = (
  db: Db
): RequestContextCreator => async ({ req, res }) => {
  const requestedAt = new Date();
  const cookies = getCookies(req.headers.cookie);
  const token = cookies.USER_SESSION_TOKEN;
  const auth = await getAuth(token, requestedAt, db);
  const dataLoaders = createDataLoaders(db);

  return {
    requestedAt,
    req,
    res,
    db,
    cookies,
    auth,
    dataLoaders,
  };
};
