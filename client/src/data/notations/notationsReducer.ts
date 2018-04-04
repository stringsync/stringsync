import { handleActions, combineActions } from 'redux-actions';
import { notationsActions as actions, notationsDefaultState } from './';

const notationsReducer = handleActions(
  {
    [combineActions(actions.setNotationsIndex)]: (state, action) => ({
      ...state,
      index: {
        fetchedAt: action.payload!.fetchedAt,
        notations: action.payload!.notations
      }
    })
  },
  notationsDefaultState
);

export default notationsReducer;
