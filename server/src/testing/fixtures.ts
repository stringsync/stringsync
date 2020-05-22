import { Db, RawUser } from '../data/db';

type Attrs<T, K extends string = 'id'> = Omit<Partial<T>, K>;

export const createUser = async (db: Db, attrs: Attrs<RawUser> = {}) => {
  const now = new Date();

  return db.models.User.create({
    username: 'username',
    email: 'email',
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
  });
};
