import { canonicalize } from '../../utils/canonicalize/canonicalize';
import { pick } from 'lodash';
import { INotation } from '../../@types/notation';
import { getAttributes } from '../../utils/getAttributes';
import { ajax } from '../../utils/ajax';

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
