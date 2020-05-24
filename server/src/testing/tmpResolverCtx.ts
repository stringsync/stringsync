import { ResolverCtx, SessionRequest } from '../util/ctx';
import { tmpGlobalCtx } from './tmpGlobalCtx';
import { createResolverCtx } from '../util/ctx';
import { Response } from 'express';
import { DeepPartial } from '../common';
import { merge } from 'lodash';

type Callback = (ctx: ResolverCtx) => any;

export const tmpResolverCtx = async (
  callback: Callback,
  reqPatch: DeepPartial<SessionRequest> = {},
  resPatch: DeepPartial<Response> = {}
) => {
  await tmpGlobalCtx(async (gctx) => {
    const req = merge({}, reqPatch) as SessionRequest;
    const res = merge({}, resPatch) as Response;
    const rctx = createResolverCtx(gctx, req, res);
    await callback(rctx);
  });
};
