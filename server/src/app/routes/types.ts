import { Handler as ExpressHandler } from 'express';
import { GlobalCtx } from '../../util/ctx';

export type Handler = (gctx: GlobalCtx) => ExpressHandler;
