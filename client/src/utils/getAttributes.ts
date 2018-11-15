import { IData } from '../@types/json-api';
import { mapKeysDeep } from './mapKeysDeep';
import { camelCase } from 'lodash';

export const getAttributes = (data: IData | IData[]) => {
  if (typeof data === 'undefined') {
    return;
  } else if (Array.isArray(data)) {
    return data
      .map(datum => datum.attributes)
      .map(attr => mapKeysDeep(attr, (_, key) => camelCase(key)));
  } else {
    return mapKeysDeep(data.attributes, (_, key) => camelCase(key));
  }
};
