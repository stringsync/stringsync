import { StringSyncRequestHandler } from '@/string-sync';

export const getHealth: StringSyncRequestHandler = (req, res) => {
  res.send('ok');
};
