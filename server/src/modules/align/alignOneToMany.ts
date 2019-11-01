import { KeyGetter, UniqueIdentifierGetter } from './types';
import { uniqBy, groupBy } from 'lodash';

interface Getters<V> {
  getKey: KeyGetter<V>;
  getUniqueIdentifier: UniqueIdentifierGetter<V>;
}

export const alignOneToMany = <V>(
  keys: Array<number | string>,
  values: V[],
  getters: Getters<V>
) => {
  const uniqValues = uniqBy(values, getters.getUniqueIdentifier);
  const valuesByKey = groupBy(uniqValues, getters.getKey);
  return new Array(keys.length).map((_, ndx) => valuesByKey[keys[ndx]] || []);
};
