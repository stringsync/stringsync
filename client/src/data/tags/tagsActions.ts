import { createAction } from 'utilities/redux';

export const SET_TAGS_INDEX = 'SET_TAGS_INDEX';

export const TagsActions = {
  setTagsIndex: (tags: Tag.ITag[]) => createAction(SET_TAGS_INDEX, { tags })
};

export type TagsActions = ActionsUnion<typeof TagsActions>;
