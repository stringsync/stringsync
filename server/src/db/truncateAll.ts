import { Db } from './types';

const onlyPermitTestEnv = (msg: string) => {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error(msg);
  }
};

export const truncateAll = async (db: Db) => {
  onlyPermitTestEnv('must have NODE_ENV=test to truncate all tables');
  for (const Model of Object.values(db.models)) {
    await Model.truncate({
      cascade: true,
      restartIdentity: true,
      logging: false,
    });
  }
};
