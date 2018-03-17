import auth from 'j-toker';

window.auth = auth;

const configureAuth = () => (
  auth.configure({
    apiUrl: `${window.location.origin}/api/v1`
  })
);

export default configureAuth;
