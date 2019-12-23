import { gql } from 'apollo-boost';
import { LoginInput, UserRoles } from 'common/types';
import { ThunkAction } from '../..';
import { pick } from 'lodash';
import { message } from 'antd';
import { getErrorMessages } from './getErrorMessages';
import { AuthActionTypes } from './types';
import { getRequestAuthPendingAction } from './getRequestAuthPendingAction';
import { getRequestAuthFailureAction } from './getRequestAuthFailureAction';
import { getRequestAuthSuccessAction } from './getRequestAuthSuccessAction';

interface LoginData {
  login: {
    user: {
      id: string;
      username: string;
      email: string;
      role: UserRoles;
    };
  };
}

const LOGIN_MUTATION = gql`
  mutation($input: LoginInput!) {
    login(input: $input) {
      user {
        id
        username
        email
        role
      }
    }
  }
`;

export const getLoginAction = (
  input: LoginInput
): ThunkAction<void, AuthActionTypes> => async (dispatch, getState, ctx) => {
  const requestAuthPendingAction = getRequestAuthPendingAction();
  dispatch(requestAuthPendingAction);

  try {
    const res = await ctx.apollo.mutate<LoginData>({
      mutation: LOGIN_MUTATION,
      variables: {
        input,
      },
    });
    if (!res.data) {
      throw new Error('no data returned from the server');
    }
    const data = res.data.login;
    const user = pick(data.user, ['id', 'username', 'email', 'role']);

    const requestAuthSuccessAction = getRequestAuthSuccessAction(user);
    dispatch(requestAuthSuccessAction);

    message.info(`logged in as @${user.username}`);
  } catch (error) {
    const errorMessages = getErrorMessages(error);
    const requestAuthFailureAction = getRequestAuthFailureAction(errorMessages);
    dispatch(requestAuthFailureAction);
  }
};
