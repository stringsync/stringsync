import { Container } from '@stringsync/di';
import { Response } from 'express';
import { applyReqRebindings } from './applyReqRebindings';
import { createReqContainerHack } from './createReqContainerHack';
import { ReqCtx, SessionRequest } from './types';

export const createReqCtx = (req: SessionRequest, res: Response, container: Container): ReqCtx => {
  const reqAt = new Date();
  const reqContainer = createReqContainerHack(container);
  applyReqRebindings(reqContainer);
  return { reqAt, req, res, container };
};
