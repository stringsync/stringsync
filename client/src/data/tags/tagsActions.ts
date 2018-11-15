import { createAction } from 'utilities/redux';
import { ITag } from '../../@types/tag';

export const SET_TAGS = 'SET_TAGS';

export const TagsActions = {
  setTags: (tags: ITag[]) => createAction(SET_TAGS, { tags })
};

export type TagsActions = ActionsUnion<typeof TagsActions>;
