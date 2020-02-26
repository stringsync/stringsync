import { gql } from 'apollo-boost';
import { ThunkAction } from '../../';
import { AuthActionTypes } from './types';
import { pick } from 'lodash';
import { getLogoutAction } from './getLogoutAction';
import { getRequestAuthPendingAction } from './getRequestAuthPendingAction';
import { getRequestAuthSuccessAction } from './getRequestAuthSuccessAction';
import { UserRoles } from '../../../common/types';

export interface AuthenticateData {
  authenticate: {
    user: {
      id: string;
      username: string;
      email: string;
      role: UserRoles;
    };
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
    const res = await ctx.apollo.mutate<AuthenticateData>({
      mutation: AUTHENTICATE_MUTATION,
    });

    if (!res.data) {
      throw new Error('user session expired or invalid');
    }

    const user = pick(res.data.authenticate.user, [
      'id',
      'username',
      'email',
      'role',
    ]);

    const requestAuthSuccessAction = getRequestAuthSuccessAction(user);
    dispatch(requestAuthSuccessAction);
  } catch (error) {
    const logoutAction = getLogoutAction();
    dispatch(logoutAction);
  }
};
