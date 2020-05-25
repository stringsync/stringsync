import { Db, RawUser } from '../data/db';
import { randStr } from './rand';

export const buildUser = (attrs: Partial<RawUser> = {}): RawUser => {
  const now = new Date();

  return {
    id: randStr(10),
    username: randStr(10),
    email: `${randStr(8)}@${randStr(5)}.com`,
    createdAt: now,
    updatedAt: now,
    role: 'student',
    avatarUrl: null,
    confirmationToken: null,
    confirmedAt: null,
    encryptedPassword:
      '$2b$10$OlF1bUqORoywn42UmkEq/O9H5X3QdDG8Iwn5tPuBFjGqGo3dA7mDe', // password = 'password',
    resetPasswordToken: null,
    resetPasswordTokenSentAt: null,
    ...attrs,
  };
};

export const createUser = async (db: Db, attrs: Partial<RawUser> = {}) => {
  const user = buildUser(attrs);
  return db.User.create(user);
};
