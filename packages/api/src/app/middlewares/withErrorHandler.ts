import { HttpStatus, UNKNOWN_ERROR_MSG } from '@stringsync/common';
import { Container } from '@stringsync/di';
import { Logger, UTIL_TYPES } from '@stringsync/util';
import { ErrorRequestHandler } from 'express';

const TYPES = { ...UTIL_TYPES };

export const withErrorHandler = (container: Container): ErrorRequestHandler => (err, req, res, next) => {
  const logger = container.get<Logger>(TYPES.Logger);
  logger.error(err.stack);
  res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(UNKNOWN_ERROR_MSG);
};
