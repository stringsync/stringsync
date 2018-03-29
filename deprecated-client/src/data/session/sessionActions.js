import { createActions } from 'redux-actions';

const sessionAction = createActions({
  SESSION: {
    LOGIN: user => ({ user }),
    LOGOUT: user => ({ user })
  }
});

export default sessionAction;
