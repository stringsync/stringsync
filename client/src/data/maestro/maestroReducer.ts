import * as actions from './maestroActions';

const getDefaultState = (): Store.IMaestroState => ({
  currentTimeMs: 0,
  vextab: null
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
