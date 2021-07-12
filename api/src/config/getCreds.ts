import { pick } from 'lodash';

type Creds = {
  username: string;
  password: string;
};

const isCreds = (value: Record<string, any>): value is Creds => {
  return typeof value.username === 'string' && typeof value.password === 'string';
};

export const getCreds = (value: unknown): Creds => {
  if (typeof value !== 'object') {
    throw TypeError(`cannot extract creds from non-object: ${value}`);
  }

  const creds = pick(value, ['username', 'password']);
  if (!isCreds(creds)) {
    // Don't log the creds object, since it might have a password in it.
    throw TypeError(`creds must be an object with a username and password`);
  }

  return creds;
};
