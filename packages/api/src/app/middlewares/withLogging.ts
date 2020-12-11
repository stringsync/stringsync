import { Container } from '@stringsync/di';
import { Logger, UTIL_TYPES } from '@stringsync/util';
import { Handler } from 'express';
import morgan from 'morgan';

export const withLogging = (container: Container): Handler => {
  const logger = container.get<Logger>(UTIL_TYPES.Logger);
  return morgan('combined', {
    stream: {
      write: (msg: string) => {
        logger.info(msg.trim());
      },
    },
  });
};
