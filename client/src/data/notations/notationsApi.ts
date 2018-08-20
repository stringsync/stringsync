
import * as $ from 'jquery';
import { NotationsActions } from './notationsActions';
import { IncludedObjects, ajax } from 'utilities';
import { Dispatch } from 'react-redux';
import { pick, sortBy } from 'lodash';

export const fetchNotations = () => async (dispatch: Dispatch) => {
  const json: API.Notations.IIndexResponse = await ajax('/api/v1/notations', {
    method: 'GET'
  });

  const included = new IncludedObjects(json.included);

  const notations: Notation.INotation[] = json.data.map(data => {
    const { id, attributes, relationships } = data;
    const tags = included.fetch(relationships.tags.data) as API.Tags.IAsIncluded[]
    const transcriber = included.fetch(relationships.transcriber.data) as API.Users.IAsIncluded;

    return {
      artistName: attributes.artist_name,
      bpm: attributes.bpm,
      createdAt: new Date(attributes.created_at),
      deadTimeMs: attributes.dead_time_ms,
      durationMs: attributes.duration_ms,
      id,
      songName: attributes.song_name,
      tags: tags.map(tag => tag.attributes.name),
      thumbnailUrl: attributes.thumbnail_url,
      transcriber: pick(transcriber.attributes, ['id', 'name', 'image']) as User.IBaseUser,
      vextabString: attributes.vextab_string,
      video: null
    };
  });

  const sortedNotations = sortBy(notations, notation => notation.createdAt).reverse();
  dispatch(NotationsActions.setNotations(sortedNotations));
};
