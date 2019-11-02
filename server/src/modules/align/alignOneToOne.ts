import { KeyGetter, UniqueIdentifierGetter, MissingValueGetter } from './types';
import { uniqBy, keyBy } from 'lodash';

interface Callbacks<V> {
  getKey: KeyGetter<V>;
  getUniqueIdentifier: UniqueIdentifierGetter<V>;
  getMissingValue: MissingValueGetter;
}

export const alignOneToOne = <V>(
  keys: Array<number | string>,
  values: V[],
  callbacks: Callbacks<V>
) => {
  const uniqValues = uniqBy(values, callbacks.getUniqueIdentifier);
  const valuesByKey = keyBy(uniqValues, callbacks.getKey);
  return new Array(keys.length).map((_, ndx) => {
    const key = keys[ndx];
    return valuesByKey[key] || callbacks.getMissingValue(key);
  });
};
