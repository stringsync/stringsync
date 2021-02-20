import { ErrorRequestHandler } from 'express';
import { Container } from 'inversify';
import { HttpStatus, UNKNOWN_ERROR_MSG } from '../../errors';
import { Logger } from '../../util';

export const withErrorHandler = (container: Container): ErrorRequestHandler => (err, req, res, next) => {
  const logger = container.get<Logger>(TYPES.Logger);
  logger.error(err.stack);
  res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(UNKNOWN_ERROR_MSG);
};
