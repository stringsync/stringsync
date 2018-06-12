import auth from 'j-toker';

window.ss = window.ss || {};
window.ss.auth = window.ss.auth || auth;
window.ss.sessionSync = { callback: null, user: {} };

/**
 * Returns the API Url for configuring jToker. Logs a warning if window.ss.env is
 * not handled.
 * 
 * @returns {string} 
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
      return '';
  }
};

/**
 * Configures jToker
 * 
 * @returns {void}
 */
const configureAuth = () => {
  auth.configure({
    apiUrl: getApiUrl(),
    confirmationSuccessUrl: () => window.location.href,
    handleTokenValidationResponse: res => {
      const user = res.data;
      window.ss.sessionSync.user = user;
      
      // Set the user in the redux store if the callback is available
      if (window.ss.sessionSync.callback) {
        window.ss.sessionSync.callback(user);
      }

      return user;
    }
  })
};

export default configureAuth;
