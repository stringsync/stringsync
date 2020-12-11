import { Container } from '@stringsync/di';
import { Logger, UTIL } from '@stringsync/util';
import { Handler } from 'express';
import morgan from 'morgan';

const TYPES = { ...UTIL.TYPES };

export const withLogging = (container: Container): Handler => {
  const logger = container.get<Logger>(TYPES.Logger);
  return morgan('combined', {
    stream: {
      write: (msg: string) => {
        logger.info(msg.trim());
      },
    },
  });
};
