import * as actions from './maestroActions';

const getDefaultState = (): Store.IMaestroState => ({
  timeMs: 0
});

export const maestroReducer = (state = getDefaultState(), action: actions.MaestroActions): Store.IMaestroState => {
  const nextState = Object.assign({}, state);

  switch (action.type) {

    case actions.SET_TIME:
      nextState.timeMs = action.payload.timeMs;
      return nextState;

    default:
      return nextState;
  }
}
