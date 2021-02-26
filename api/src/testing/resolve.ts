import { graphql } from 'graphql';
import * as uuid from 'uuid';
import { UserRole } from '../domain';
import { container } from '../inversify.config';
import { generateSchema, ResolverCtx } from '../resolvers';
import { SessionUser } from '../server';
import { Body, RequestType } from './types';

class SessionUserStorage {
  private sessionUser: SessionUser = { id: '', role: UserRole.STUDENT, isLoggedIn: false };

  get(): SessionUser {
    return this.sessionUser;
  }

  set(sessionUser: SessionUser) {
    this.sessionUser = sessionUser;
  }
}

type Resolved<T extends RequestType, N extends Exclude<keyof T, '__typename'>> = {
  res: Body<T, N>;
  ctx: ResolverCtx;
};

type ResolveOpts = {
  reqAt?: Date;
  reqId?: string;
  sessionUser?: SessionUser;
};

export const resolve = async <
  T extends RequestType,
  N extends Exclude<keyof T, '__typename'>,
  V extends Record<string, any> = Record<string, any>
>(
  query: string,
  variables: V,
  opts: ResolveOpts = {}
): Promise<Resolved<T, N>> => {
  const schema = generateSchema();

  const reqAt = opts.reqAt || new Date();
  const reqId = opts.reqId || uuid.v4();

  const sessionUserStorage = new SessionUserStorage();
  if (opts.sessionUser) {
    sessionUserStorage.set(opts.sessionUser);
  }

  const ctx: ResolverCtx = {
    getReqId: () => reqId,
    getReqAt: () => reqAt,
    getContainer: () => container,
    getSessionUser: () => sessionUserStorage.get(),
    setSessionUser: (sessionUser: SessionUser) => {
      sessionUserStorage.set(sessionUser);
    },
  };

  const res = (await graphql(schema, query, undefined, ctx, variables)) as Body<T, N>;

  return { res, ctx };
};
