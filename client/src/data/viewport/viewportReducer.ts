import { handleActions, combineActions } from 'redux-actions';
import { viewportActions as actions, viewportDefaultState, getViewportType } from './';

const viewportReducer = handleActions(
  {
    [combineActions(actions.setViewportWidth)]: (_state, action) => ({
      width: action.payload!.width,
      type: getViewportType(action.payload!.width)
    })
  },
  viewportDefaultState
);

export default viewportReducer;
