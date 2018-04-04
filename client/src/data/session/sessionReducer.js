import { handleActions, combineActions } from 'redux-actions';
import { sessionActions as actions, sessionDefaultState as defaultState } from './';

const sessionReducer = handleActions({
  [combineActions(actions.session.login)]: (state, action) => ({
    ...state
  }),
  [combineActions(actions.session.logout)]: (state, action) => ({
    ...state
  })
}, defaultState);

export default sessionReducer;
