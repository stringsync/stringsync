import { KeyGetter, UniqueIdentifierGetter, MissingValueGetter } from './types';
import { uniqBy, groupBy } from 'lodash';

interface Getters<V> {
  getKey: KeyGetter<V>;
  getUniqueIdentifier: UniqueIdentifierGetter<V>;
  getMissingValue: MissingValueGetter;
}

export const alignOneToMany = <V>(
  keys: Array<number | string>,
  values: V[],
  getters: Getters<V>
) => {
  const uniqValues = uniqBy(values, getters.getUniqueIdentifier);
  const valuesByKey = groupBy(uniqValues, getters.getKey);

  const len = keys.length;
  const aligned = new Array(len);
  for (let ndx = 0; ndx < len; ndx++) {
    const key = keys[ndx];
    const value = valuesByKey[key] || getters.getMissingValue(key);
    aligned[ndx] = value;
  }

  return aligned;
};
