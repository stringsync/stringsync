import { mapKeys, mapValues, isPlainObject } from 'lodash';

export const mapKeysDeep = (obj, callback) => (
  mapValues(
    mapKeys(obj, callback),
    val => (isPlainObject(val) ? mapKeysDeep(val, callback) : val)
  )
);
