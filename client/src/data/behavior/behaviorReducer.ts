import * as actions from './behaviorActions';
import { pick } from 'lodash';

export type IBehaviorState = Store.IBehaviorState;

const getDefaultState = (): IBehaviorState => ({
  showLoop: false
});

export const behaviorReducer = (state = getDefaultState(), action: actions.BehaviorActions): IBehaviorState => {
  const nextState = Object.assign({}, state);

  switch(action.type) {

    case actions.RESET_ALL_BEHAVIORS:
      return getDefaultState();

    case actions.RESET_BEHAVIOR:
      Object.assign(nextState, pick(getDefaultState(), [action.payload.behavior]));
      return nextState;

    case actions.SET_BEHAVIOR:
      nextState[action.payload.behavior] = action.payload.value;
      return nextState;

    default:
      return nextState;
  }
}