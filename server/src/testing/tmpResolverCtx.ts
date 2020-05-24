import { ResolverCtx, SessionRequest } from '../util/ctx';
import { tmpGlobalCtx } from './tmpGlobalCtx';
import { createResolverCtx } from '../util/ctx';
import { Response } from 'express';
import { DeepPartial } from '../common';
import { merge } from 'lodash';
import { IGraphQLToolsResolveInfo } from 'graphql-tools';

type Callback = (ctx: ResolverCtx, info: IGraphQLToolsResolveInfo) => any;

export const tmpResolverCtx = async (
  callback: Callback,
  reqPatch: DeepPartial<SessionRequest> = {},
  resPatch: DeepPartial<Response> = {},
  infoPatch: DeepPartial<IGraphQLToolsResolveInfo> = {}
) => {
  await tmpGlobalCtx(async (gctx) => {
    const req = merge({}, reqPatch) as SessionRequest;
    const res = merge({}, resPatch) as Response;
    const info = merge({}, infoPatch) as IGraphQLToolsResolveInfo;
    const rctx = createResolverCtx(gctx, req, res);
    await callback(rctx, info);
  });
};
