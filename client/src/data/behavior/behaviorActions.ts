import { createAction } from 'utilities/redux';

// Helps keep line length in action definitions
type State = StringSync.Store.IBehaviorState;

export const RESET_ALL_BEHAVIORS = 'RESET_ALL_BEHAVIORS';
export const RESET_BEHAVIOR = 'RESET_BEHAVIOR';
export const SET_BEHAVIOR = 'SET_BEHAVIOR';

export const BehaviorActions = {
  resetAllBehaviors: () => createAction(RESET_ALL_BEHAVIORS),
  resetBehavior: (behavior: keyof State) => createAction(RESET_BEHAVIOR, { behavior }),
  setBehavior: (behavior: keyof State, value: State[keyof State]) => createAction(SET_BEHAVIOR, { behavior, value })
};

export type BehaviorActions = ActionsUnion<typeof BehaviorActions>;
