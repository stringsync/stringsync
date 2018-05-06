import { sessionActions as actions } from './';
import { indexIncludedObjects, camelCaseKeys } from 'utilities';

export const login = () => async dispatch => {
};

export const signup = (username, email, password) => async dispatch => {
  const user = { username, email, password };
  const response = await fetch('/auth/sign_in', {
    method: 'POST',
    body: JSON.stringify(user),
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  });

  console.log(response);
};