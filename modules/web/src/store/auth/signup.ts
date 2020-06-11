import { SignupInput, UserRoles } from '../../common';
import { ThunkAction } from '../';
import { AuthActionTypes } from './types';
import { getErrorMessages } from '../../util';
import { authPending } from './authPending';
import { authFailure } from './authFailure';

interface SignupData {
  user: {
    id: string;
    username: string;
    email: string;
    role: UserRoles;
    confirmedAt: Date;
  };
}

// const SIGNUP_MUTATION = gql`
//   mutation($input: SignupInput!) {
//     signup(input: $input) {
//       user {
//         id
//         username
//         email
//         role
//         confirmedAt
//       }
//     }
//   }
// `;

export const signup = (
  input: SignupInput
): ThunkAction<void, AuthActionTypes> => async (dispatch, getState, ctx) => {
  dispatch(authPending());

  try {
    // const res = await ctx.client.call<SignupData, InputOf<SignupInput>>(
    //   SIGNUP_MUTATION,
    //   {
    //     input,
    //   }
    // );
    // dispatch(authSuccess(res.user));
    // message.info(`logged in as @${res.user.username}`);
  } catch (error) {
    const errorMessages = getErrorMessages(error);
    dispatch(authFailure(errorMessages));
  }
};
