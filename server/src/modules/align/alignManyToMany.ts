import {
  KeysGetter,
  UniqueIdentifierGetter,
  MissingValueGetter,
} from './types';
import { uniqBy } from 'lodash';

interface Getters<V> {
  getKeys: KeysGetter<V>;
  getUniqueIdentifier: UniqueIdentifierGetter<V>;
  getMissingValue: MissingValueGetter;
}

interface ValuesByKey<V> {
  [key: string]: V[];
}

export const alignManyToMany = <V>(
  keys: Array<number | string>,
  values: V[],
  getters: Getters<V>
) => {
  const uniqValues = uniqBy(values, getters.getUniqueIdentifier);
  const valuesByKey = uniqValues.reduce<ValuesByKey<V>>((obj, value) => {
    for (const key of getters.getKeys(value)) {
      obj[key] = obj[key] || [];
      obj[key].push(value);
    }
    return obj;
  }, {});
  return new Array(keys.length).map((_, ndx) => {
    const key = keys[ndx];
    return valuesByKey[key] || getters.getMissingValue(key);
  });
};
