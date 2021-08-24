import { useCallback, useState } from 'react';

type FlatSerializable = {
  [key: string]: string | number | boolean | null;
};

type TypeChecker<T> = (value: any) => value is T;

/**
 * Merges only the keys that exist in the dst object iff the corresponding value types match. This
 * excludes any extra keys, but preserves the values in src. This is particularly useful when the
 * src object schema's change, and you want to make a best effort to keep the compatible key-values
 * that already exist.
 */
const sanitize = <T extends FlatSerializable>(dst: T, src: any) => {
  const nextObj = { ...dst };

  if (typeof src !== 'object') {
    return nextObj;
  }

  for (const [k, v] of Object.entries(dst)) {
    if (!(k in src)) {
      continue;
    }
    if (typeof src[k] === typeof v) {
      (nextObj as FlatSerializable)[k] = src[k];
    }
  }

  return nextObj;
};

// Adapted from https://usehooks.com/useLocalStorage/
export const useLocalStorage = <T extends FlatSerializable>(
  key: string,
  initialValue: T,
  isType: TypeChecker<T>
): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      const parsedValue = item ? JSON.parse(item) : initialValue;
      return isType(parsedValue) ? parsedValue : sanitize(initialValue, parsedValue);
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T) => {
      try {
        setStoredValue(sanitize(initialValue, value));
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(error);
      }
    },
    [initialValue, key]
  );

  return [storedValue, setValue];
};
