import { TagsActions } from './tagsActions';
import { Dispatch } from 'react-redux';
import { ajax } from 'utilities';

export const fetchTags = () => async (dispatch: Dispatch) => {
  const json:  API.Tags.IIndexResponse = await ajax('/api/v1/tags', {
    method: 'GET'
  });

  const tags = json.data.map(tag => {
    const { id } = tag;
    const { name } = tag.attributes;

    return { id, name };
  });

  dispatch(TagsActions.setTags(tags));
}