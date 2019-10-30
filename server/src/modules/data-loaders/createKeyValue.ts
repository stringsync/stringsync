import { KeyValue } from './types';

export const createKeyValue = <V>(
  key: string | number,
  value: V
): KeyValue<V> => ({
  key,
  value,
});
