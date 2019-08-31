import { StringSync } from '@/types/string-sync';

export const getRoot: StringSync.RequestHandler = (req, res, next) => {
  res.json({
    user: req.user,
    message: 'Hello, from the server!',
  });
};
