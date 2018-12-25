import $ from 'jquery';
import auth from 'j-toker';
import { SessionActions } from '../data/session';

/**
 * Returns the API Url for configuring jToker. Logs a warning if window.ss.env is
 * not handled.
 *
 * @returns {string}
 */
const getApiUrl = (): string => {
  switch (window.ss.env) {
    case 'development':
      return `http://${window.location.hostname}:3001`;
    case 'production':
      return window.location.origin;
    default:
      return '';
  }
};

const syncSession = (response: any) => {
  const user = response.data;
  window.ss.store.dispatch(SessionActions.setSession(user));

  return user;
};

/**
 * Configures jToker in non test environments
 *
 * @returns {void}
 */
const configureAuth = (): void => {
  window.ss.auth = auth;
  window.ss.auth.configure({
    apiUrl: getApiUrl(),
    handleTokenValidationResponse: syncSession,
    handleLoginResponse: syncSession
  });
};

export default configureAuth;
