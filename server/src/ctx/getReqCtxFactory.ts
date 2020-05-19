import { GlobalCtx, ReqCtx, Auth } from './types';
import { RequestHandler } from 'express';
import { getDataLoaders } from '../data-loaders';
import { parseCookies } from './parseCookies';
import { getAuthenticatedUser } from '../db';

export const getReqCtxFactory = (globalCtx: GlobalCtx) => async <E extends any>(
  expressCtx: E,
  requestedAt?: Date
): Promise<ReqCtx<E>> => {
  requestedAt = requestedAt || new Date();
  const { req, res } = expressCtx;
  const dataLoaders = getDataLoaders(globalCtx.db);
  const cookies = parseCookies(req.headers.cookie);
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
