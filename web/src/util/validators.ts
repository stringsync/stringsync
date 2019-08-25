import { EMAIL_REGEX } from '../constants/EMAIL_REGEX';

export const createIsRequiredValidator = (message: string) => (value: any) => {
  return !!value || message;
};
export const emailIsRequired = createIsRequiredValidator('email is required');
export const passwordIsRequired = createIsRequiredValidator('password is required');

export const emailFormat = (email: string) => {
  return EMAIL_REGEX.test(email) || 'email must be valid';
};