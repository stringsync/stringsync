import { INotation } from '../../@types/notation';
import * as $ from 'jquery';
import { canonicalize } from '../../utils/canonicalize/canonicalize';
import { pick } from 'lodash';
import { getAttributes } from '../../utils/getAttributes';

interface INotationData {
  artist_name: string;
  bpm: number;
  dead_time_ms: number;
  duration_ms: number;
  song_name: string;
  thumbnail: File;
  vextab_string: string;
  tag_ids: string[];
  video: {
    kind: string;
    src: string;
  };
}

const JSON_TRANSFORMS = Object.freeze({
  created_at: createdAt => new Date(createdAt),
  updated_at: updatedAt => new Date(updatedAt),
  tags: tag => tag.attributes.name,
  transcriber: transcriber => pick(transcriber.attributes, ['id', 'name', 'image']),
  video: video => video.attributes
});

const formData = (notation: INotationData) => {
  const data = new FormData();

  Object.keys(notation).forEach(key => {
    const value = notation[key];

    switch (key) {
      case 'thumbnail':
        data.append(`notation[thumbnail]`, value);
        break;

      case 'video':
        data.append(`notation[video_attributes][kind]`, value.kind.toLowerCase());
        data.append(`notation[video_attributes][src]`, value.src);
        break;

      case 'tag_ids':
        value.forEach((tagId: string) => data.append(`notation[tag_ids][]`, tagId));
        break;

      default:
        data.append(`notation[${key}]`, value);
        break;
    }
  });

  return data;
};

export const createNotation = async (notation: INotationData): Promise<INotation> => {
  const data = formData(notation);
  const response = await $.ajax('/api/v1/notations', {
    contentType: false,
    data,
    method: 'POST',
    processData: false
  });
  const json = canonicalize(response, JSON_TRANSFORMS);
  return getAttributes(json.data);
};

export const updateNotation = async (notationId: number, notation: INotationData): Promise<INotation> => {
  const data = formData(notation);
  const response = await $.ajax(`/api/v1/notations/${notationId}`, {
    data: { notation },
    method: 'PUT'
  });
  const json = canonicalize(response, JSON_TRANSFORMS);
  return getAttributes(json.data);
};
