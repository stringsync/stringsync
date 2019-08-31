import { StringSyncRequestHandler } from '@/string-sync';

export const getRoot: StringSyncRequestHandler = (req, res, next) => {
  res.json({
    user: req.user,
    message: 'Hello, from the server!',
  });
};
