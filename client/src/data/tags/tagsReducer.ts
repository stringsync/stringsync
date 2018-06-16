import * as actions from './tagsActions';

export type ITagsState = StringSync.Store.ITagsState;

const getDefaultState = (): ITagsState => ({
  index: []
});

export const tagsReducer = (state = getDefaultState(), action: actions.TagsActions): ITagsState => {
  const nextState = { index: [...state.index] };

  switch(action.type) {

    case actions.SET_TAGS_INDEX:
      nextState.index = action.payload.tags;
      return nextState;

    default:
      return nextState;
  }
};
