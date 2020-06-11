import { ThunkAction } from '../';
// import { message } from 'antd';
import { getErrorMessages } from '../../util';
import { AuthActionTypes } from './types';
import { authPending } from './authPending';
import { authFailure } from './authFailure';
// import { authSuccess } from './authSuccess';

export const login = (input: any): ThunkAction<void, AuthActionTypes> => async (dispatch, getState, ctx) => {
  dispatch(authPending());

  try {
    // const res = await ctx.client.call<LoginData, InputOf<LoginInput>>(
    //   LOGIN_MUTATION,
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
