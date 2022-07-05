import { DebounceSettings } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { Duration } from '../util/Duration';
import { useDebouncedCallback } from './useDebouncedCallback';

type Debounce = () => void;

export const useDebouncer = (
  delay: Duration,
  options?: DebounceSettings
): [debouncing: boolean, debounce: Debounce] => {
  const [debouncing, setDebouncing] = useState(false);

  const start = useCallback(() => {
    setDebouncing(true);
  }, []);

  const stop = useDebouncedCallback(
    () => {
      setDebouncing(false);
    },
    delay.ms,
    options
  );

  useEffect(() => {
    if (!debouncing) {
      return;
    }
    stop();
    return () => {
      stop.cancel();
    };
  }, [debouncing, stop]);

  return [debouncing, start];
};
