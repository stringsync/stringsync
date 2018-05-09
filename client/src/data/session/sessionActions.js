import { createActions } from 'redux-actions';

const sessionAction = createActions({
  SESSION: {
    SET: user => ({ user }),
    RESET: undefined
  }
});

export default sessionAction;
