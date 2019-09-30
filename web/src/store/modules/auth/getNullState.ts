import { AuthState } from '.';

const getNullState = (): AuthState => ({
  id: -1,
  username: '',
  email: '',
  jwt: '',
  isLoggedIn: false,
});

export default getNullState;
