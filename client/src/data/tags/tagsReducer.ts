import * as actions from './tagsActions';

// For type annotation
const getDefaultState = (): Tag.ITag[] => [];

export const tagsReducer = (state = getDefaultState(), action: actions.TagsActions): Tag.ITag[] => {
  let nextState = state.map(tag => Object.assign({}, tag));

  switch(action.type) {

    case actions.SET_TAGS:
      nextState = action.payload.tags;
      return nextState;

    default:
      return nextState;
  }
};
