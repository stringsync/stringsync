import bcrypt from 'bcrypt';

export const isPassword = (password: string, encryptedPassword: string) => {
  return bcrypt.compare(password, encryptedPassword);
};
