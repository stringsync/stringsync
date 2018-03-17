import auth from 'j-toker';

window.auth = auth;

const configureAuth = () => (
  auth.configure({
    apiUrl: 'https://shielded-forest-68418.herokuapp.com/api/v1/'
  })
);

export default configureAuth;
