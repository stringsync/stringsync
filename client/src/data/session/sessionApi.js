import { sessionActions as actions } from './';
import { indexIncludedObjects, camelCaseKeys } from 'utilities';
import { omit } from 'lodash';

export const login = () => async dispatch => {
};

export const signup = user => async dispatch => {
  // const data = JSON.stringify({
  //   user: {
  //     name: user.username,
  //     email: user.email,
  //     password: user.password,
  //   },
  //   session: {
  //     remember: user.remember
  //   }
  // });

  // const response = await fetch('/api/v1/users', {
  //   method: 'POST',
  //   body: data,
  //   headers: new Headers({ 'Content-Type': 'application/json' })
  // });

  // const json = await response.json();

  // debugger

  window.auth.emailSignUp({
    name: user.username,
    email: user.email,
    password: user.password,
    password_confirmation: user.passwordConfirmation
  }).then(res => {
    debugger
  });
};