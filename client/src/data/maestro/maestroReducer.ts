import * as actions from './maestroActions';

const getDefaultState = (): Store.IMaestroState => ({
  bpm: 120,
  timeMs: 0
});

export const maestroReducer = (state = getDefaultState(), action: actions.MaestroActions): Store.IMaestroState => {
  const nextState = Object.assign(getDefaultState(), state);

  switch (action.type) {

    case actions.UPDATE:
      return Object.assign(nextState, action.payload.state);

    default:
      return nextState;
  }
}
