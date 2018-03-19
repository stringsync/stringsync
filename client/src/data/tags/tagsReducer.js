import { handleActions, combineActions } from 'redux-actions';
import { tagsActions as actions, tagsDefaultState as defaultState } from './';

const tagsReducer = handleActions({
  [combineActions(actions.tags.index.set)]: (state, action) => action.tags
}, defaultState);

export default tagsReducer;
