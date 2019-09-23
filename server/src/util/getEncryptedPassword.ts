import bcrypt from 'bcrypt';

const HASH_ROUNDS = 10;

const getEncryptedPassword = (password: string) => {
  return bcrypt.hash(password, HASH_ROUNDS);
};

export default getEncryptedPassword;
