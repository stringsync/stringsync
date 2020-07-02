import { applyReqRebindings } from './applyReqRebindings';
import { createReqContainerHack } from './createReqContainerHack';
import { ReqCtx } from './types';
import { Request, Response } from 'express';
import * as uuid from 'uuid';
import { Container } from 'inversify';

export const createReqCtx = (req: Request, res: Response, container: Container): ReqCtx => {
  const reqAt = new Date();
  const reqId = uuid.v4();
  const reqContainer = createReqContainerHack(container);
  applyReqRebindings(reqContainer);
  return { reqAt, reqId, req, res, container: reqContainer };
};
