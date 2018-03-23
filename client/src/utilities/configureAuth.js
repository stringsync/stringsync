import auth from 'j-toker';

window.ss.auth = window.ss.auth || auth;

/**
 * Returns the API Url for configuring jToker. Logs a warning if window.ss.env is
 * not handled.
 * 
 * @return {string} 
 */
const getApiUrl = () => {
  switch (window.ss.env) {
    case 'development':
    case 'DEVELOPMENT':
      return 'http://localhost:3001';
    case 'production':
    case 'PRODUCTION':
      return window.location.origin;
    default:
      console.warn(`no API url for ${window.ss.env}`);
      return '';
  }
};

/**
 * Configures jToker
 * 
 * @return {void}
 */
const configureAuth = () => {
  auth.configure({
    apiUrl: getApiUrl(),
    confirmationSuccessUrl: () => window.location.href
  })
};

export default configureAuth;
