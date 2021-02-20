import { Handler } from 'express';
import morgan from 'morgan';
import { TYPES } from '../../../inversify.constants';
import { Logger } from '../../../util';
import { Ctx } from './Ctx';

export const withLogging: Handler = (req, res, next) => {
  const ctx = Ctx.get(req);
  const container = ctx.getContainer();
  const logger = container.get<Logger>(TYPES.Logger);

  const middleware = morgan('combined', {
    stream: {
      write: (msg: string) => {
        logger.debug(msg.trim());
      },
    },
  });

  return middleware(req, res, next);
};
