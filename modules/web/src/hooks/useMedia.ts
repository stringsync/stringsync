import { useEffect, useState, useCallback, useMemo } from 'react';

/**
 * src: https://usehooks.com/useMedia/
 *
 * This hook creates media query watchers on the window object, that
 * will return different values based on the first watcher that matches.
 */
export const useMedia = <T>(
  queries: string[],
  values: T[],
  defaultValue: T
): T => {
  if (queries.length !== values.length) {
    throw new TypeError(
      "'queries' and 'values' arguments must be the same length"
    );
  }

  // These objects will be responsible for triggering a callback
  // whenever any of the queries' criterion changes.
  const mediaQueryLists = useMemo(() => {
    return queries.map((query) => window.matchMedia(query));
  }, [queries]);

  // This getter method will find the first media query list that
  // matches and either return the value at the same index or
  // the default value.
  const getValue = useCallback(() => {
    const index = mediaQueryLists.findIndex(
      (mediaQueryList) => mediaQueryList.matches
    );
    return index < 0 ? defaultValue : values[index];
  }, [mediaQueryLists, values, defaultValue]);

  // Create media query list listeners, which trigger a
  // handler that changes the value that is returned
  // from this function.
  const [value, setValue] = useState(getValue());
  useEffect(() => {
    const handler = () => setValue(getValue);
    for (const mediaQueryList of mediaQueryLists) {
      mediaQueryList.addListener(handler);
    }
    return () => {
      for (const mediaQueryList of mediaQueryLists) {
        mediaQueryList.removeListener(handler);
      }
    };
  }, [getValue, mediaQueryLists]);

  return value;
};
