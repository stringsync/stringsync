import { StringSync } from '@/types/string-sync';

export const getHealth: StringSync.RequestHandler = (req, res) => {
  res.send('ok');
};
