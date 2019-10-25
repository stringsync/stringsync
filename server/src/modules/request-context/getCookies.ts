import { defaults } from 'lodash';
import cookie from 'cookie';
import { Cookies } from './types';

const DEFAULT_COOKIES: Cookies = Object.freeze({
  USER_SESSION_TOKEN: '',
});

export const getCookies = (headerCookies: string | undefined) => {
  const cookies = cookie.parse(headerCookies || '');
  return defaults(cookies, DEFAULT_COOKIES);
};
