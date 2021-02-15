import { DebounceSettings, isEqual } from 'lodash';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from './useDebouncedCallback';
import { usePrevious } from './usePrevious';

// Taken from: https://github.com/gnbaron/use-lodash-debounce/blob/master/src/use-debounce.ts

export const useDebounce = <T>(value: T, delay: number = 0, options?: DebounceSettings): T => {
  const [currValue, setCurrVal] = useState(value);
  const prevValue = usePrevious(currValue);
  const debouncedCallback = useDebouncedCallback((value: T) => setCurrVal(value), delay, options);

  useEffect(() => {
    // does trigger the debounce timer initially
    if (!isEqual(value, prevValue)) {
      debouncedCallback(value);
      // cancel the debounced callback on clean up
      return debouncedCallback.cancel;
    }
  }, [debouncedCallback, prevValue, value]);

  return currValue;
};
