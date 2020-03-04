import { gql } from 'apollo-boost';
import { ThunkAction } from '../../';
import { AuthActionTypes } from './types';
import { logout } from './logout';
import { authPending } from './authPending';
import { authSuccess } from './authSuccess';
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

export const authenticate = (): ThunkAction<void, AuthActionTypes> => async (
  dispatch,
  getState,
  ctx
) => {
  dispatch(authPending());

  try {
    const res = await ctx.client.call<AuthenticateData, undefined>(
      AUTHENTICATE_MUTATION
    );
    dispatch(authSuccess(res.user));
  } catch (error) {
    dispatch(logout());
  }
};
