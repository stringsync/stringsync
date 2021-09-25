import equal from 'fast-deep-equal/react';
import { useEffect, useState } from 'react';

type Comparator = (a: any, b: any) => boolean;

export const useMemoCmp = <T>(proposedValue: T, isEqual: Comparator = equal): T => {
  const [value, setValue] = useState(proposedValue);

  useEffect(() => {
    setValue((currentValue) => (isEqual(currentValue, proposedValue) ? currentValue : proposedValue));
  }, [isEqual, proposedValue]);

  return value;
};
