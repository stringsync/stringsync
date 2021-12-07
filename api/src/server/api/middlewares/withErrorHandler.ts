import { ErrorRequestHandler } from 'express';
import * as uuid from 'uuid';
import { HttpStatus, UNKNOWN_ERROR_MSG } from '../../../errors';
import { TYPES } from '../../../inversify.constants';
import { Logger } from '../../../util';
import { Ctx } from './Ctx';

export const withErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  const id = uuid.v4();
  const ctx = Ctx.get(req);
  const container = ctx.getContainer();
  const logger = container.get<Logger>(TYPES.Logger);
  logger.error(`${id}: ${err.stack}`);
  res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(`${UNKNOWN_ERROR_MSG}: ${id}`);
};
