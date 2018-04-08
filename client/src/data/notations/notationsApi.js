import { createAction } from 'redux-actions';
import { notationsActions as actions } from './';
import { indexIncludedObjects, camelCaseKeys } from 'utilities';

export const fetchAllNotations = () => async dispatch => {
  const response = await fetch('/api/v1/notations');
  const json = await response.json();

  const included = indexIncludedObjects(json.included);

  const notations = json.data.map(data => {
    const { id, attributes, links, relationships } = data;
    const tags = relationships.tags.data.map(({ id }) => included.tags[id]);
    const transcriber = included.users[relationships.transcriber.data.id];
    const video = included.videos[relationships.video.data.id];

    return camelCaseKeys({
      id,
      attributes,
      links,
      relationships: {
        tags,
        transcriber,
        video
      }
    }, true);
  });

  dispatch(actions.notations.index.set(notations));
};
