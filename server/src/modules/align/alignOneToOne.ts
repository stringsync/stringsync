import { KeyGetter, UniqueIdentifierGetter } from './types';
import { uniqBy, keyBy } from 'lodash';

class MissingValueError extends Error {
  constructor(key: string | number) {
    super(`missing value for key: ${key}`);
  }
}

interface Getters<V> {
  getKey: KeyGetter<V>;
  getUniqueIdentifier: UniqueIdentifierGetter<V>;
}

export const alignOneToOne = <V>(
  keys: Array<number | string>,
  values: V[],
  getters: Getters<V>
) => {
  const uniqValues = uniqBy(values, getters.getUniqueIdentifier);
  const valuesByKey = keyBy(uniqValues, getters.getKey);
  return new Array(keys.length).map((_, ndx) => {
    const key = keys[ndx];
    return valuesByKey[key] || new MissingValueError(key);
  });
};
