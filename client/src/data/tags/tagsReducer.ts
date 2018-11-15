import * as actions from './tagsActions';
import { ITag } from '../../@types/tag';

// For type annotation
const getDefaultState = (): ITag[] => [];

export const tagsReducer = (state = getDefaultState(), action: actions.TagsActions): ITag[] => {
  let nextState = state.map(tag => Object.assign({}, tag));

  switch (action.type) {

    case actions.SET_TAGS:
      nextState = action.payload.tags;
      return nextState;

    default:
      return nextState;
  }
};
