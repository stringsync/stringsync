import { gql } from 'apollo-boost';
import { ThunkAction } from '../../';
import { AuthActionTypes } from './types';
import { getLogoutAction } from './getLogoutAction';
import { getRequestAuthPendingAction } from './getRequestAuthPendingAction';
import { getRequestAuthSuccessAction } from './getRequestAuthSuccessAction';
import { UserRoles } from '../../../common/types';

export interface AuthenticateData {
  user: {
    id: string;
    username: string;
    email: string;
    role: UserRoles;
  };
}

export const AUTHENTICATE_MUTATION = gql`
  mutation {
    authenticate {
      user {
        id
        username
        email
        role
      }
    }
  }
`;

export const getAuthenticateAction = (): ThunkAction<
  void,
  AuthActionTypes
> => async (dispatch, getState, ctx) => {
  const requestAuthPendingAction = getRequestAuthPendingAction();
  dispatch(requestAuthPendingAction);

  try {
    const res = await ctx.client.call<AuthenticateData, undefined>(
      AUTHENTICATE_MUTATION
    );
    const requestAuthSuccessAction = getRequestAuthSuccessAction(res.user);
    dispatch(requestAuthSuccessAction);
  } catch (error) {
    const logoutAction = getLogoutAction();
    dispatch(logoutAction);
  }
};
