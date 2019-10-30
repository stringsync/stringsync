import { KeyValue, OrderedValues, MissingKeyError } from './types';
import { indexUniquelyBy } from './indexUniquelyBy';

/**
 * This function enforces the invariant that the values array must be sorted the
 * same way as the keys array.
 */
export const getOrderedDataLoaderValues = <V>(
  keyName: string,
  keys: Array<number | string>,
  unorderedValues: Array<KeyValue<V>>
): OrderedValues<V> => {
  const valuesByKey = indexUniquelyBy(keyName, unorderedValues);
  const len = keys.length;
  const orderedValues: OrderedValues<V> = new Array(len);
  for (let ndx = 0; ndx < len; ndx++) {
    const key = keys[ndx];
    if (key in valuesByKey) {
      const value = valuesByKey[key];
      orderedValues[ndx] = value;
    } else {
      orderedValues[ndx] = new MissingKeyError(keyName, key.toString());
    }
  }
  return orderedValues;
};
