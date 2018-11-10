import * as $ from 'jquery';
import auth from 'j-toker';
import { Store } from 'redux';
import { SessionActions } from '../data/session';
import { ISession } from '../@types/session';

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

  $.ajaxSetup({
    beforeSend: (xhr, settings) => {
      // append outbound auth headers
      window.ss.auth.appendAuthHeaders(xhr, settings);
    },
  });

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
    confirmationSuccessUrl: () => window.location.href,
    handleTokenValidationResponse: syncSession,
    handleLoginResponse: syncSession
  });
};

export default configureAuth;
