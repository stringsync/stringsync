import { ConfirmEmailInput, InputOf } from '../../../common';
import { ThunkAction } from '../../types';
import { EmailActionTypes } from './types';
import { gql } from 'apollo-boost';
import { getErrorMessages } from '../../../util';
import { confirmEmailPending } from './confirmEmailPending';
import { confirmEmailFailure } from './confirmEmailFailure';
import { confirmEmailSuccess } from './confirmEmailSuccess';
import { message } from 'antd';

interface ConfirmEmailData {
  id: string;
}

export const CONFIRM_EMAIL_MUTATION = gql`
  mutation($input: ConfirmEmailInput!) {
    confirmEmail(input: $input) {
      id
    }
  }
`;

export const getConfirmEmailAction = (
  input: ConfirmEmailInput
): ThunkAction<void, EmailActionTypes> => async (dispatch, getState, ctx) => {
  dispatch(confirmEmailPending());
  try {
    const res = await ctx.client.call<
      ConfirmEmailData,
      InputOf<ConfirmEmailInput>
    >(CONFIRM_EMAIL_MUTATION, {
      input,
    });
    dispatch(confirmEmailSuccess(res.id));
    message.info(`email confirmed`);
  } catch (error) {
    const errorMessages = getErrorMessages(error);
    dispatch(confirmEmailFailure(errorMessages));
  }
};
