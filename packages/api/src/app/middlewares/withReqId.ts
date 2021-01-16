import { Container } from '@stringsync/di';
import { Handler } from 'express';
import * as uuid from 'uuid';

const REQ_ID_HEADER = 'X-Request-Id';

export const withReqId = (container: Container): Handler => (req, res, next) => {
  const id = uuid.v4();
  (req as any).id = id;
  res.setHeader(REQ_ID_HEADER, id);
  next();
};
