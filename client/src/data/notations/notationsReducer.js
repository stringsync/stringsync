import { handleActions, combineActions } from 'redux-actions';
import { merge } from 'lodash';
import { notationsActions as actions, notationsDefaultState as defaultState } from './';

const notationsReducer = handleActions({
  [combineActions(actions.notations.index.set)]: (state, action) => ({
    ...state,
    index: {
      fetchedAt: Date.now(),
      notations: action.payload.notations
    }
  }),
  [combineActions(actions.notations.show.set)]: (state, action) => ({
    ...state,
    show: action.payload.notation
  }),
  [combineActions(actions.notations.edit.set)]: (state, action) => ({
    ...state,
    edit: action.payload.notation
  }),
  [combineActions(actions.notations.edit.update)]: (state, action) => ({
    ...state,
    edit: merge(state.edit, action.payload.notation)
  })
}, defaultState);

export default notationsReducer;
