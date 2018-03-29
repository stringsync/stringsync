import { handleActions, combineActions } from 'redux-actions';
import {
  viewportActions as actions,
  viewportDefaultState as defaultState,
  getViewportType
} from './';

const viewportReducer = handleActions({
  [combineActions(actions.viewport.width.set)]: (state, action) => ({
    width: action.payload.width,
    type: getViewportType(action.payload.width)
  })
}, defaultState);

export default viewportReducer;
