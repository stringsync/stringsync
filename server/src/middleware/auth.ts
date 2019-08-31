import { RequestHandler } from 'express';
import { StringSyncRequestHandler } from '@/string-sync';

export const auth: StringSyncRequestHandler = (req, res, next) => {
  req.user = { username: 'foo' };
  next();
};
