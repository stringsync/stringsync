import { gql } from 'apollo-boost';
import { ThunkAction } from '../..';
import { AuthActionTypes } from './types';
import { getClearAuthAction } from './getClearAuthAction';

interface LogoutData {
  logout: {
    user: {
      id: string;
      username: string;
      email: string;
    };
  };
}

const LOGOUT_MUTATION = gql`
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

export const getLogoutAction = (): ThunkAction<void, AuthActionTypes> => async (
  dispatch,
  getState,
  ctx
) => {
  const clearAuthAction = getClearAuthAction();
  dispatch(clearAuthAction);

  try {
    ctx.apollo.mutate<LogoutData>({
      mutation: LOGOUT_MUTATION,
    });
  } catch (error) {
    // TODO use sentry or some other tool that will track
    // when logouts fail
    console.error(error);
  }
};
