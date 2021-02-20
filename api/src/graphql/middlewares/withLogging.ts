import { Handler } from 'express';
import { Container } from 'inversify';
import morgan from 'morgan';
import { TYPES } from '../../inversify.constants';
import { Logger } from '../../util';

export const withLogging = (container: Container): Handler => {
  const logger = container.get<Logger>(TYPES.Logger);
  return morgan('combined', {
    stream: {
      write: (msg: string) => {
        logger.debug(msg.trim());
      },
    },
  });
};
