import { gql } from 'apollo-boost';
import { ThunkAction } from '../';
import { AuthActionTypes } from './types';
import { clearAuth } from './clearAuth';

interface LogoutData {
  logout: {
    user: {
      id: string;
      username: string;
      email: string;
    };
  };
}

export const LOGOUT_MUTATION = gql`
  mutation {
    logout {
      user {
        id
        username
        email
      }
    }
  }
`;

export const logout = (): ThunkAction<void, AuthActionTypes> => async (
  dispatch,
  getState,
  ctx
) => {
  dispatch(clearAuth());

  try {
    await ctx.client.call<LogoutData>(LOGOUT_MUTATION);
  } catch (error) {
    // TODO use sentry or some other tool that will track
    // when logouts fail
  }
};
