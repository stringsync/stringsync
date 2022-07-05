import { debounce, DebouncedFunc, DebounceSettings } from 'lodash';
import { useCallback } from 'react';
import { useMemoCmp } from './useMemoCmp';

// Taken from: https://github.com/gnbaron/use-lodash-debounce/blob/master/src/use-debounce.ts

export const useDebouncedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 0,
  options?: DebounceSettings
): DebouncedFunc<T> => {
  options = useMemoCmp(options);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(debounce(callback, delay, options), [callback, delay, options]);
};
