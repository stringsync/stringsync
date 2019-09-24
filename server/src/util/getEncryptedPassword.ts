import bcrypt from 'bcrypt';

const HASH_ROUNDS = 10;

export const getEncryptedPassword = (password: string) => {
  return bcrypt.hash(password, HASH_ROUNDS);
};
