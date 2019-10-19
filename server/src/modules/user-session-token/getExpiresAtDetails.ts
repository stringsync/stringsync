import { USER_SESSION_TOKEN_MAX_AGE_MS } from './constants';

export const getExpiresAtDetails = (from: Date) => {
  const expiresAtMsFromEpoch = from.getTime() + USER_SESSION_TOKEN_MAX_AGE_MS;
  return {
    expiresAt: new Date(expiresAtMsFromEpoch),
    maxAgeMs: USER_SESSION_TOKEN_MAX_AGE_MS,
  };
};
