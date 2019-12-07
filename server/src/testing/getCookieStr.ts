import { Cookies } from 'node-mocks-http';

export const getCookieStr = (cookies: Cookies): string => {
  const parts = new Array<string>();
  for (const [key, value] of Object.entries(cookies)) {
    parts.push(`${key}=${value}`);
  }
  return parts.join(' ');
};
