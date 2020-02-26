import { gql } from 'apollo-boost';
import { SignupInput, UserRoles } from '../../../common/types';
import { ThunkAction } from '../..';
import { AuthActionTypes } from './types';
import { pick } from 'lodash';
import { message } from 'antd';
import { getErrorMessages } from '../../../util';
import { getRequestAuthPendingAction } from './getRequestAuthPendingAction';
import { getRequestAuthSuccessAction } from './getRequestAuthSuccessAction';
import { getRequestAuthFailureAction } from './getRequestAuthFailureAction';

interface SignupData {
  signup: {
    user: {
      id: string;
      username: string;
      email: string;
      role: UserRoles;
    };
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
    const res = await ctx.apollo.mutate<SignupData>({
      mutation: SIGNUP_MUTATION,
      variables: {
        input,
      },
    });
    if (!res.data) {
      throw new Error('no data returned from the server');
    }
    const data = res.data.signup;
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
