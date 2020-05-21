import { Handler as ExpressHandler } from 'express';
import { GlobalCtx } from '../../util/ctx';

export type Handler = (ctx: GlobalCtx) => ExpressHandler;
