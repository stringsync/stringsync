import * as auth from 'j-toker';

/**
 * Returns the API Url for configuring jToker. Logs a warning if window.ss.env is
 * not handled.
 * 
 * @returns {string} 
 */
const getApiUrl = (): string => {
  switch (window.ss.env) {
    case 'development':
      return 'http://localhost:3001';
    case 'production':
      return window.location.origin;
    default:
      return '';
  }
};

/**
 * Configures jToker in non test environments
 * 
 * @returns {void}
 */
const configureAuth = (): void => {
  window.ss.auth = auth as auth.IJTokerAuth;
  
  window.ss.auth.configure({
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
