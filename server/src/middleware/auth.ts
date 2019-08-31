import { StringSync } from '@/string-sync';

export const auth: StringSync.RequestHandler = (req, res, next) => {
  req.user = { username: 'foo' };
  next();
};
