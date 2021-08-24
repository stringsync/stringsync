import { useCallback, useState } from 'react';
import { JsonValue } from 'type-fest';

type TypeChecker<T> = (value: any) => value is T;

// Adapted from https://usehooks.com/useLocalStorage/
export const useLocalStorage = <T extends JsonValue>(
  key: string,
  initialValue: T,
  isType: TypeChecker<T>
): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      const parsedValue = item ? JSON.parse(item) : initialValue;
      return isType(parsedValue) ? parsedValue : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T) => {
      try {
        setStoredValue(value);
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.log(error);
      }
    },
    [key]
  );

  return [storedValue, setValue];
};
