import * as actions from './sessionActions';
import { getDefaultState } from './getDefaultState';
import { ISession } from '../../@types/session';

export const sessionReducer = (state = getDefaultState(), action: actions.SessionActions): ISession => {
  const nextState = { ...state };

  let user;
  switch (action.type) {

    case actions.SET_SESSION:
      user = action.payload.user;
      return {
        email: user.email,
        id: user.id,
        image: user.image || null,
        name: user.name,
        provider: user.provider,
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
