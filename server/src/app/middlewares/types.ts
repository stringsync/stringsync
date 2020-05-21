import { GlobalCtx } from '../../util/ctx';
import { Handler } from 'express';

export type Middleware = (ctx: GlobalCtx) => Handler;
