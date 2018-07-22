import { TagsActions } from './tagsActions';
import { Dispatch } from 'react-redux';

export const fetchAllTags = () => async (dispatch: Dispatch) => {
  const response = await fetch('/api/v1/tags');
  const json: API.Tags.IIndexResponse = await response.json();
  const tags = json.data.map(tag => {
    const { id } = tag;
    const { name } = tag.attributes;

    return { id, name };
  });

  dispatch(TagsActions.setTagsIndex(tags));

  return tags;
}