import { RequestHandler } from 'express';
import { APP_VERSION } from '../../../util';

export const withVersion: RequestHandler = (req, res, next) => {
  res.set('X-App-Version', APP_VERSION);
  next();
};
