import equal from 'fast-deep-equal/react';
import { first } from 'lodash';
import { useEffect, useState } from 'react';
import { Dimensions, Nullable } from '../util/types';

const DEFAULT_DIMENSIONS: Dimensions = { width: 0, height: 0 };

export const useDimensions = (element: Nullable<Element>, defaultDimensions = DEFAULT_DIMENSIONS) => {
  const [dimensions, setDimensions] = useState(defaultDimensions);

  useEffect(() => {
    if (!element) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = first(entries);
      if (!entry) {
        return;
      }
      const { width, height } = entry.contentRect;
      const nextDimensions = { width, height };
      setDimensions((currentDimensions) => {
        // prevent unecessary re-renders if nothing changed
        return equal(currentDimensions, nextDimensions) ? currentDimensions : nextDimensions;
      });
    });
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [element]);

  return dimensions;
};
