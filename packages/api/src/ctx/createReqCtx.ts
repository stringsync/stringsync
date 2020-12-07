import { Container } from '@stringsync/di';
import { Response } from 'express';
import * as uuid from 'uuid';
import { applyReqRebindings } from './applyReqRebindings';
import { createReqContainerHack } from './createReqContainerHack';
import { ReqCtx, SessionRequest } from './types';

export const createReqCtx = (req: SessionRequest, res: Response, container: Container): ReqCtx => {
  const reqAt = new Date();
  const reqId = uuid.v4();
  const reqContainer = createReqContainerHack(container);
  applyReqRebindings(reqContainer);
  return { reqAt, reqId, req, res, container };
};
