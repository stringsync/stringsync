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
  return new Array(keys.length).map((_, ndx) => {
    const key = keys[ndx];
    return valuesByKey[key] || getters.getMissingValue(key);
  });
};
