import { ITag } from '../../@types/tag';
import { canonicalize } from '../../utils/canonicalize/canonicalize';
import { mapKeysDeep } from '../../utils/mapKeysDeep';
import { camelCase } from 'lodash';
import { ajax } from '../../utils/ajax';

export const fetchAllTags = async (): Promise<ITag[]> => {
  const response = await ajax('/api/v1/tags.json', { method: 'GET' });
  const json = canonicalize(response);
  const tags = json.data.map(data => data.attributes);
  return tags.map(tag => mapKeysDeep(tag, (_, key) => camelCase(key)));
};
