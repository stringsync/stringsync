import { MIN_REFRESH_AGE_MS } from './constants';

export const shouldRefreshUserSession = (requestedAt: Date, issuedAt: Date) => {
  const ageMs = requestedAt.getTime() - issuedAt.getTime();
  return ageMs >= MIN_REFRESH_AGE_MS;
};
