import { Db, RawUser } from '../data/db';
import { makeEncryptedPassword } from '../util/password';
import faker from 'faker';

type Attrs<T, K extends string = 'id'> = Omit<Partial<T>, K>;

export const createUser = async (db: Db, attrs: Attrs<RawUser> = {}) => {
  const refDate = faker.date.recent();

  return db.models.User.create({
    username: faker.internet.userName(),
    email: faker.internet.email(),
    createdAt: faker.date.past(undefined, refDate),
    updatedAt: faker.date.future(undefined, refDate),
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
