import { Container } from '@stringsync/di';
import { Handler } from 'express';
import * as uuid from 'uuid';

export const withReqId = (container: Container): Handler => (req, res, next) => {
  (req as any).id = uuid.v4();
  next();
};
