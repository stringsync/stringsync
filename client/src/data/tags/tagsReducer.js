import { handleActions, combineActions } from 'redux-actions';
import { tagsActions } from './';

const { setTags } = tagsActions;

const defaultState = [];

const tagsReducer = handleActions({
  [combineActions(setTags)]: (state, action) => action.tags
}, defaultState);

export default tagsReducer;
