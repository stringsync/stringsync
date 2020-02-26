import { gql } from 'apollo-boost';
import { SignupInput, UserRoles, InputOf } from '../../../common/types';
import { ThunkAction } from '../..';
import { AuthActionTypes } from './types';
import { message } from 'antd';
import { getErrorMessages } from '../../../util';
import { getRequestAuthPendingAction } from './getRequestAuthPendingAction';
import { getRequestAuthSuccessAction } from './getRequestAuthSuccessAction';
import { getRequestAuthFailureAction } from './getRequestAuthFailureAction';

interface SignupData {
  user: {
    id: string;
    username: string;
    email: string;
    role: UserRoles;
  };
}

const SIGNUP_MUTATION = gql`
  mutation($input: SignupInput!) {
    signup(input: $input) {
      user {
        id
        username
        email
        role
      }
    }
  }
`;

export const getSignupAction = (
  input: SignupInput
): ThunkAction<void, AuthActionTypes> => async (dispatch, getState, ctx) => {
  const requestAuthPendingAction = getRequestAuthPendingAction();
  dispatch(requestAuthPendingAction);

  try {
    const res = await ctx.client.call<SignupData, InputOf<SignupInput>>(
      SIGNUP_MUTATION,
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
