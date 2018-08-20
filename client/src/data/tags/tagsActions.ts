import { createAction } from 'utilities/redux';

export const SET_TAGS = 'SET_TAGS';

export const TagsActions = {
  setTags: (tags: Tag.ITag[]) => createAction(SET_TAGS, { tags })
};

export type TagsActions = ActionsUnion<typeof TagsActions>;
