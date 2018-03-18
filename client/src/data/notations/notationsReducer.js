import { handleActions, combineActions } from 'redux-actions';
import { notationsActions } from './';

const { setNotations } = notationsActions;

const defaultState = [];

const notationsReducer = handleActions({
  [combineActions(setNotations)]: (state, action) => action.notations
}, defaultState);

export default notationsReducer;
