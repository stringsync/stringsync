import { mapKeys, mapValues, isPlainObject } from 'lodash';

const mapKeysDeep = (object, callback) => (
  mapValues(
    mapKeys(object, callback),
    val => (isPlainObject(val) ? mapKeysDeep(val, callback) : val)
  )
);

export default mapKeysDeep;
