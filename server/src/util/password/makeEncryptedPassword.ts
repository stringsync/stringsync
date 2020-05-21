import bcrypt from 'bcrypt';

const HASH_ROUNDS = 10;

export const makeEncryptedPassword = (password: string): Promise<string> => {
  return bcrypt.hash(password, HASH_ROUNDS);
};
