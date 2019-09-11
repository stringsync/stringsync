import { useEffect, useState, useCallback, useMemo } from 'react';

// https://usehooks.com/useMedia/
export const useMedia = <T>(
  queries: string[],
  values: T[],
  defaultValue: T
): T => {
  const mediaQueryLists = useMemo(() => {
    return queries.map((query) => window.matchMedia(query));
  }, [queries]);

  const getValue = useCallback(() => {
    const index = mediaQueryLists.findIndex(
      (mediaQueryList) => mediaQueryList.matches
    );
    const value = values[index];
    return typeof value === 'undefined' ? defaultValue : value;
  }, [mediaQueryLists, values, defaultValue]);

  // setValue triggers rerenders
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
