import auth from 'j-toker';

const configureAuth = () => (
  auth.configure({
    apiUrl: 'https://shielded-forest-68418.herokuapp.com/',
    authProviderPaths: {
      github: '/auth/facebook'
    }
  })
);

export default configureAuth;
