import { USER_SESSION_TOKEN_MAX_AGE_MS } from './constants';

export const getExpiresAt = (from: Date) => {
  const expiresAtMsFromEpoch = from.getTime() + USER_SESSION_TOKEN_MAX_AGE_MS;
  return new Date(expiresAtMsFromEpoch);
};
