import auth from 'j-toker';

window.auth = auth;

const configureAuth = () => (
  auth.configure({
    apiUrl: 'http://localhost:3001',
    confirmationSuccessUrl: () => window.location.href
  })
);

export default configureAuth;
