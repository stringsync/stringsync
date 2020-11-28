import { KeysGetter, UniqueIdentifierGetter, MissingValueGetter } from './types';
import { uniqBy } from 'lodash';

interface Getters<V, M> {
  getKeys: KeysGetter<V>;
  getUniqueIdentifier: UniqueIdentifierGetter<V>;
  getMissingValue: MissingValueGetter<M>;
}

interface ValuesByKey<V> {
  [key: string]: V[];
}

export const alignManyToMany = <V, M>(
  keys: Array<number | string>,
  values: V[],
  getters: Getters<V, M>
): Array<V[] | M> => {
  const uniqValues = uniqBy(values, getters.getUniqueIdentifier);
  const valuesByKey = uniqValues.reduce<ValuesByKey<V>>((obj, value) => {
    for (const key of getters.getKeys(value)) {
      obj[key] = obj[key] || [];
      obj[key].push(value);
    }
    return obj;
  }, {});

  const len = keys.length;
  const aligned = new Array(len);
  for (let ndx = 0; ndx < len; ndx++) {
    const key = keys[ndx];
    const value = valuesByKey[key] || getters.getMissingValue(key);
    aligned[ndx] = value;
  }

  return aligned;
};
