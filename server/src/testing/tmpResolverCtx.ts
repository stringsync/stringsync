import { ResolverCtx, SessionRequest } from '../util/ctx';
import { tmpGlobalCtx } from './tmpGlobalCtx';
import { createResolverCtx } from '../util/ctx';
import { Response } from 'express';
import { DeepPartial } from '../common';
import { merge } from 'lodash';
import { IGraphQLToolsResolveInfo } from 'graphql-tools';

type Callback = (ctx: ResolverCtx, info: IGraphQLToolsResolveInfo) => any;

type Patch = DeepPartial<{
  req: SessionRequest;
  res: Response;
  info: IGraphQLToolsResolveInfo;
}>;

export const tmpResolverCtx = async (callback: Callback, patch: Patch) => {
  await tmpGlobalCtx(async (gctx) => {
    const req = merge({}, patch.req) as SessionRequest;
    const res = merge({}, patch.res) as Response;
    const info = merge({}, patch.info) as IGraphQLToolsResolveInfo;
    const rctx = createResolverCtx(gctx, req, res);
    await callback(rctx, info);
  });
};
