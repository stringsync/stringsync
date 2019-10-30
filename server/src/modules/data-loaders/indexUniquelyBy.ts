import { isDeepStrictEqual } from 'util';
import { KeyValue, UniqueIndex, DuplicateKeyError } from './types';

export const indexUniquelyBy = <V>(
  keyName: string,
  objects: KeyValue<V>[]
): UniqueIndex<V> => {
  return objects.reduce<UniqueIndex<V>>((memo, object) => {
    const key = object.key;
    // If we have at least two objects that have the same keys but different values,
    // then we violate the 'uniquely' invariant of this function. It is valid for
    // more than one object to have the same key, as long as their values as equivalent,
    // based on util.isDeepStrictEqual.
    if (key in memo && !isDeepStrictEqual(object.value, memo[key])) {
      memo[key] = new DuplicateKeyError(keyName, key.toString());
    } else {
      memo[key] = object.value;
    }
    return memo;
  }, {});
};
