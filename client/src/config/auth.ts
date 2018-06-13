import auth from 'j-toker';

window.ss.auth = auth;

/**
 * Returns the API Url for configuring jToker. Logs a warning if window.ss.env is
 * not handled.
 * 
 * @returns {string} 
 */
const getApiUrl = (): string => {
  switch (window.ss.env.toLowerCase()) {
    case 'development':
      return 'http://localhost:3001';
    case 'production':
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
const configureAuth = (): void => {
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
