import { ensureNotError } from './ensureNotError';

export const ensureNoErrors = <T>(array: Array<Error | T>): Array<T> => {
  for (const el of array) {
    ensureNotError(el);
  }
  return array as Array<T>;
};
