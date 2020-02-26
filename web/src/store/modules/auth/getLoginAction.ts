import { gql } from 'apollo-boost';
import { LoginInput, UserRoles, InputOf } from '../../../common/types';
import { ThunkAction } from '../..';
import { message } from 'antd';
import { getErrorMessages } from '../../../util';
import { AuthActionTypes } from './types';
import { getRequestAuthPendingAction } from './getRequestAuthPendingAction';
import { getRequestAuthFailureAction } from './getRequestAuthFailureAction';
import { getRequestAuthSuccessAction } from './getRequestAuthSuccessAction';

interface LoginData {
  user: {
    id: string;
    username: string;
    email: string;
    role: UserRoles;
  };
}

export const LOGIN_MUTATION = gql`
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
    const res = await ctx.client.call<LoginData, InputOf<LoginInput>>(
      LOGIN_MUTATION,
      {
        input,
      }
    );

    const requestAuthSuccessAction = getRequestAuthSuccessAction(res.user);
    dispatch(requestAuthSuccessAction);

    message.info(`logged in as @${res.user.username}`);
  } catch (error) {
    const errorMessages = getErrorMessages(error);
    const requestAuthFailureAction = getRequestAuthFailureAction(errorMessages);
    dispatch(requestAuthFailureAction);
  }
};
