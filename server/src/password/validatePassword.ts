import { PASSWORD_MIN_LEN, PASSWORD_MAX_LEN } from './constants';
import { ValidationError } from 'sequelize';

export const validatePassword = (password: string) => {
  if (password.length < PASSWORD_MIN_LEN) {
    throw new ValidationError(
      `password must have at least ${PASSWORD_MIN_LEN} characters`
    );
  }
  if (password.length > PASSWORD_MAX_LEN) {
    throw new ValidationError(
      `password must have no more than ${PASSWORD_MAX_LEN} characters`
    );
  }
};
