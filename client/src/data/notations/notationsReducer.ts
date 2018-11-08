import * as actions from './notationsActions';

// For type annotation
const getDefaultState = (): INotation[] => [];

export const notationsReducer = (state = getDefaultState(), action: actions.NotationsActions): INotation[] => {
  let nextState = state.map((notation: INotation) => Object.assign({}, notation));

  switch (action.type) {

    case actions.SET_NOTATIONS:
      nextState = action.payload.notations.map((notation: INotation) => Object.assign({}, notation));
      return nextState;

    default:
      return nextState;
  }
};
