import { ISession } from '../../@types/session';

export const getDefaultState = (): ISession => ({
  email: '',
  id: -1,
  image: null,
  name: '',
  provider: 'email',
  role: 'student',
  signedIn: false,
  uid: '-1'
});
