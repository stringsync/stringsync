
import { NotationsActions } from './notationsActions';
import { IncludedObjects } from 'utilities';
import { Dispatch } from 'react-redux';
import { pick, sortBy } from 'lodash';

export const fetchAllNotations = () => async (dispatch: Dispatch) => {
  const response = await fetch('/api/v1/notations');
  const json: API.Notations.IIndexResponse = await response.json();
  const included = new IncludedObjects(json.included);

  const notations: Notation.INotation[] = json.data.map(data => {
    const { id, attributes, links, relationships } = data;
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

  const sorted = sortBy(notations, notation => notation.createdAt).reverse();
  dispatch(NotationsActions.setNotationsIndex(sorted));

  return sorted;
};

export const fetchNotation = (notationId: number) => async (dispatch: Dispatch) => {
  const response = await fetch(`/api/v1/notations/${notationId}`);
  const json: API.Notations.IShowResponse = await response.json();
  const included = new IncludedObjects(json.included);

  const { id, attributes, links, relationships } = json.data;
  const tags = included.fetch(relationships.tags.data) as API.Tags.IAsIncluded[];
  const transcriber = included.fetch(relationships.transcriber.data) as API.Users.IAsIncluded;
  const video = included.fetch(relationships.video.data) as API.Videos.IAsIncluded;

  const notation = {
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
    video: video.attributes
  };

  dispatch(NotationsActions.setNotationShow(notation));

  return notation;
};
