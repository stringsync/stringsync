import { ErrorRequestHandler } from 'express';
import { HttpStatus, UNKNOWN_ERROR_MSG } from '../../../errors';
import { TYPES } from '../../../inversify.constants';
import { Logger } from '../../../util';
import { Ctx } from './Ctx';

export const withErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const ctx = Ctx.get(req);
  const container = ctx.getContainer();
  const logger = container.get<Logger>(TYPES.Logger);
  logger.error(err.stack);
  res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(UNKNOWN_ERROR_MSG);
};
