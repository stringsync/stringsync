import { gql } from 'apollo-boost';
import { ThunkAction } from '../../';
import { AuthActionTypes } from './types';
import { pick } from 'lodash';
import { getLogoutAction } from './getLogoutAction';
import { getRequestAuthPendingAction } from './getRequestAuthPendingAction';
import { getRequestAuthSuccessAction } from './getRequestAuthSuccessAction';

export interface ReauthData {
  reauth: {
    user: {
      id: string;
      username: string;
      email: string;
    };
  };
}

export const REAUTH_MUTATION = gql`
  mutation {
    reauth {
      user {
        id
        username
        email
      }
    }
  }
`;

export const getReauthAction = (): ThunkAction<void, AuthActionTypes> => async (
  dispatch,
  getState,
  ctx
) => {
  const requestAuthPendingAction = getRequestAuthPendingAction();
  dispatch(requestAuthPendingAction);
  try {
    const res = await ctx.apollo.mutate<ReauthData>({
      mutation: REAUTH_MUTATION,
    });
    if (!res.data) {
      throw new Error('user session expired or invalid');
    }
    const user = pick(res.data.reauth.user, ['id', 'username', 'email']);
    const requestAuthSuccessAction = getRequestAuthSuccessAction(user);
    dispatch(requestAuthSuccessAction);
  } catch (error) {
    const logoutAction = getLogoutAction();
    dispatch(logoutAction);
  }
};
