import { GlobalCtx } from '../../util/ctx';
import { Handler } from 'express';

export type Middleware = (gctx: GlobalCtx) => Handler;
