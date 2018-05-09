import { sessionActions as actions } from './';
import { indexIncludedObjects, camelCaseKeys } from 'utilities';
import { omit } from 'lodash';

export const login = (user, onSuccess, onError) => async dispatch => (
  window.ss.auth.emailSignIn({
    email: user.email,
    password: user.password
  }).then(res => {
    onSuccess(res);
  }).fail(res => {
    onError(res);
  })
);

export const signup = (user, onSuccess, onError) => async dispatch => (
  window.ss.auth.emailSignUp({
    name: user.username,
    email: user.email,
    password: user.password,
    password_confirmation: user.passwordConfirmation
  }).then(res => {
    onSuccess(res);
  }).fail(res => {
    onError(res);
  })
);