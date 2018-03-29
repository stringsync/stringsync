import { createActions } from 'redux-actions';

const usersActions = createActions({
  USERS: {
    INDEX: {
      SET: users => ({ users })
    },
    SHOW: {
      SET: user => ({ user })
    },
    EDIT: {
      SET: user => ({ user }),
      UPDATE: user => ({ user })
    }
  }
});

export default usersActions;
