import { canonicalize } from '../../../utils/canonicalize/canonicalize';
import { pick, mapKeys, camelCase } from 'lodash';
import * as $ from 'jquery';
import { mapKeysDeep } from '../../../utils/mapKeysDeep';

export const fetchAllNotations = async () => {
  const response = await $.ajax('/api/v1/notations.json', { method: 'GET' });
  const json = canonicalize(response, {
    created_at: createdAt => new Date(createdAt),
    updated_at: updatedAt => new Date(updatedAt),
    tags: tag => tag.attributes.name,
    transcriber: transcriber => pick(transcriber.attributes, ['id', 'name', 'image']),
    video: video => video.attributes
  });

  const notations = json.data.map(data => data.attributes);
  return notations.map(notation => mapKeysDeep(notation, (_, key) => camelCase(key)));
};
