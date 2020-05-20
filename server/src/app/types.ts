import { GlobalCtx } from '../util/ctx';
import { Handler as ExpressHandler } from 'express';

export type Handler = (ctx: GlobalCtx) => ExpressHandler;
