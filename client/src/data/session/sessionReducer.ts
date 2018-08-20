import * as actions from './sessionActions';
import { SessionProviders } from 'j-toker';

export type ISessionState = Store.ISessionState;

const getDefaultState = (): ISessionState => ({
  email: '',
  id: -1,
  image: null,
  name: '',
  provider: 'email',
  role: 'student',
  signedIn: false,
  uid: '-1'
});

export const sessionReducer = (state = getDefaultState(), action: actions.SessionActions): ISessionState => {
  const nextState = {...state};

  let user;
  switch(action.type) {
    
    case actions.SET_SESSION:
      user = action.payload.user;
      return {
        email: user.email,
        id: user.id,
        image: user.image || null,
        name: user.name,
        provider: user.provider as SessionProviders,
        role: user.role,
        signedIn: true,
        uid: user.uid
      };

    case actions.RESET_SESSION:
      return getDefaultState();

    default:
      return nextState;
  }
};
