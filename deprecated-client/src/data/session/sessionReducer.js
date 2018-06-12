import { handleActions, combineActions } from 'redux-actions';
import { sessionActions as actions, sessionDefaultState as defaultState } from './';
import { pick } from 'lodash';

const sessionReducer = handleActions({
  [combineActions(actions.session.set)]: (state, action) => ({
    signedIn: true,
    ...pick(action.payload.user, ['email', 'uid', 'id', 'image', 'name', 'provider', 'role'])
  }),
  [combineActions(actions.session.reset)]: (state, action) => Object.assign({}, defaultState)
}, defaultState);

export default sessionReducer;
