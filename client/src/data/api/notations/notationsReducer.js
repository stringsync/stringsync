import { handleActions, combineActions } from 'redux-actions';
import { setNotations } from 'data';
import { merge } from 'lodash';

const defaultState = [];

const notationsReducer = handleActions({
  [combineActions(setNotations)]: (state, action) => merge([], action.notations)
}, defaultState);

export default notationsReducer;
