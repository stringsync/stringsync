import { INotation } from '../../@types/notation';
import { canonicalize } from '../../utils/canonicalize/canonicalize';
import { pick } from 'lodash';
import { getAttributes } from '../../utils/getAttributes';
import { ajax } from '../../utils/ajax';

interface IRawNotationFormData {
  artist_name?: string;
  bpm?: number;
  dead_time_ms?: number;
  duration_ms?: number;
  song_name?: string;
  thumbnail?: File;
  vextab_string?: string;
  tag_ids?: string[];
  video?: {
    kind: string;
    src: string;
  };
}

const getFormData = (notation: IRawNotationFormData) => {
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

const handleResponse = (response: any) => {
  const json = canonicalize(response, {
    created_at: createdAt => new Date(createdAt),
    updated_at: updatedAt => new Date(updatedAt),
    tags: tag => tag.attributes.name,
    transcriber: transcriber => pick(transcriber.attributes, ['id', 'name', 'image']),
    video: video => video.attributes
  });
  return getAttributes(json.data);
};

export const fetchNotation = async (notationId: number): Promise<INotation> => {
  const response = await ajax(`/api/v1/notations/${notationId}`, {
    method: 'GET'
  });
  return handleResponse(response);
};

export const fetchAllNotations = async (): Promise<INotation[]> => {
  const response = await ajax('/api/v1/notations.json', { method: 'GET' });
  const json = canonicalize(response, {
    created_at: createdAt => new Date(createdAt),
    updated_at: updatedAt => new Date(updatedAt),
    tags: tag => tag.attributes.name,
    transcriber: transcriber => pick(transcriber.attributes, ['id', 'name', 'image']),
    video: video => video.attributes
  });
  return getAttributes(json.data);
};

export const createNotation = async (notation: IRawNotationFormData): Promise<INotation> => {
  const data = getFormData(notation);
  const response = await ajax('/api/v1/notations', {
    contentType: false,
    data,
    method: 'POST',
    processData: false
  });
  return handleResponse(response);
};

export const updateNotation = async (notationId: number, notation: IRawNotationFormData): Promise<INotation> => {
  const data = getFormData(notation);
  const response = await ajax(`/api/v1/notations/${notationId}`, {
    contentType: false,
    data,
    method: 'PUT',
    processData: false
  });
  return handleResponse(response);
};
