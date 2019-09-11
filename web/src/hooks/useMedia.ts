import { useEffect, useState } from 'react';

// https://usehooks.com/useMedia/
export const useMedia = <T>(
  queries: string[],
  values: T[],
  defaultValue: T
) => {
  const mediaQueryLists = queries.map((query) => window.matchMedia(query));

  const getValue = () => {
    const index = mediaQueryLists.findIndex(({ matches }) => matches);
    const value = values[index];
    return typeof value === 'undefined' ? defaultValue : value;
  };

  const [value, setValue] = useState(getValue);

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
  }, []);

  return value;
};
